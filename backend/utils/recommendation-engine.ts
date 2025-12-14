// recommendation-engine.ts
import { ContractorWebScraper, ContractorProfile } from './contractorWebScraper';
import type { ContractorBid } from './contractorWebScraper';
import OpenAI from 'openai';
import { config } from 'dotenv';

config();

// Interface matching AnalysisRequest from Python schemas
interface ProjectDetails {
    project_type?: string;
    project_description: string;
    starting_price?: number;
    timeline?: string;
    location: string;
    project_size?: string;
    urgency?: string;
}

interface AnalysisRequest {
    project_details: ProjectDetails;
    contractor_bids: ContractorBid[];
    analysis_depth?: string;
}

interface MarketAnalysis {
    average_bid: number;
    bid_range: {
        min: number;
        max: number;
    };
    total_contractors: number;
    analyzed_contractors: number;
    failed_analyses: number;
}

interface Metadata {
    processing_time_seconds: number;
    analysis_depth: string;
    timestamp: string;
}

interface AnalysisResult {
    recommendation: string;
    contractor_profiles: Record<string, any>[];
    market_analysis: MarketAnalysis;
    metadata: Metadata;
}

class RecommendationEngine {
    private webScraper: ContractorWebScraper;

    constructor() {
        this.webScraper = new ContractorWebScraper();
    }

    /**
     * The main analysis method
     */
    async analyzeContractors(request: AnalysisRequest): Promise<AnalysisResult> {
        const startTime = Date.now();

        // Analyze all the contractors concurrently
        const analysisTasks = request.contractor_bids.map(contractor =>
            this.webScraper.analyzeContractor(
                contractor,
                request.project_details.project_type || "full",
                request.project_details.location
            )
        );

        const profiles = await Promise.allSettled(analysisTasks);

        // Get rid of failed analyses
        const validProfiles: ContractorProfile[] = profiles
            .filter((result): result is PromiseFulfilledResult<ContractorProfile> =>
                result.status === 'fulfilled'
            )
            .map(result => result.value);

        const failedCount = profiles.length - validProfiles.length;

        if (failedCount > 0) {
            console.log(`${failedCount} analyses failed.`);
        }

        // Calculate pricing metrics
        const bidAmounts = request.contractor_bids.map(bid => bid.bid_amount);
        const avgBid = this._mean(bidAmounts);

        // Add pricing competitiveness to profiles
        for (let i = 0; i < validProfiles.length; i++) {
            const bidAmount = request.contractor_bids[i].bid_amount;
            validProfiles[i].pricing_competitiveness = this._calculatePricingCompetitiveness(bidAmount, avgBid);
        }

        // Sort the profiles by overall score
        validProfiles.sort((a, b) => b.overall_score - a.overall_score);

        // Generate AI recommendation
        const recommendation = await this._generateRecommendation(request, validProfiles);

        const processingTime = (Date.now() - startTime) / 1000; // Convert to seconds

        return {
            recommendation,
            contractor_profiles: validProfiles.map(profile => profile.toJSON()),
            market_analysis: {
                average_bid: avgBid,
                bid_range: {
                    min: Math.min(...bidAmounts),
                    max: Math.max(...bidAmounts)
                },
                total_contractors: request.contractor_bids.length,
                analyzed_contractors: validProfiles.length,
                failed_analyses: failedCount,
            },
            metadata: {
                processing_time_seconds: processingTime,
                analysis_depth: request.analysis_depth || "standard",
                timestamp: new Date().toISOString(),
            }
        };
    }

    /**
     * Calculate how competitive a bid is on a 0-1 scale
     */
    private _calculatePricingCompetitiveness(bidAmount: number, avgBid: number): number {
        if (avgBid === 0) {
            return 0.5;
        }

        const ratio = bidAmount / avgBid;

        if (0.9 <= ratio && ratio <= 1.1) {
            return 1.0;
        } else if (ratio < 0.5) {
            return 0.2;
        } else if (ratio > 2.0) {
            return 0.1;
        } else {
            // Linear decrease as we move away from average
            return Math.max(0.1, 1.0 - Math.abs(ratio - 1.0));
        }
    }

    /**
     * Generate AI recommendation
     */
    async _generateRecommendation(request: AnalysisRequest, profiles: ContractorProfile[]): Promise<string> {
        if (!profiles || profiles.length === 0) {
            return "Unable to analyze any contractors. Please verify contractor information and try again.";
        }

        // Prepare AI context
        const numProfiles = profiles.length;
        const k = Math.min(numProfiles, 3);
        const top3 = profiles.slice(0, k);
        const contextParts: string[] = [];

        const contractorNumberToNameMap: Record<string, string> = {};

        for (let i = 0; i < top3.length; i++) {
            const profile = top3[i];
            const contractorBid = request.contractor_bids.find(
                bid => bid.contractor_id === profile.contractor_id
            );

            if (!contractorBid) continue;

            // contractorNumberToNameMap[`Contractor #${i + 1}`] = profile.company_name;

            contextParts.push(
                `
                    Contractor #${i + 1}: ${profile.company_name}
                    - Bid Amount: $${contractorBid.bid_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    - Overall Score: ${profile.overall_score.toFixed(2)}/1.0
                    - Rating: ${profile.rating || 'Unknown'}
                    - Experience: ${profile.years_in_business || 'Unknown'} years
                    - Specialties: ${profile.specialties.length > 0 ? profile.specialties.join(', ') : 'General'}
                    - License Verified: ${profile.license_verified}
                    - Insurance: ${profile.insurance_verified}
                    - BBB Rating: ${profile.bbb_rating || 'Not found'}
                    - Green Flags: ${profile.green_flags.join('; ')}
                    - Red Flags: ${profile.red_flags.join('; ')}
                    - Data Confidence: ${profile.confidence_score.toFixed(2)}
                `
            );
        }

        const context = contextParts.join('\n');
        const avgBid = this._mean(request.contractor_bids.map(bid => bid.bid_amount));
        const minBid = Math.min(...request.contractor_bids.map(bid => bid.bid_amount));
        const maxBid = Math.max(...request.contractor_bids.map(bid => bid.bid_amount));

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const prompt = `
            You are Vendle's expert contractor recommendation system. Based on comprehensive analysis, provide a clear recommendation for this homeowner.
    
            PROJECT DETAILS:
            Type: ${request.project_details.project_type}
            Description: ${request.project_details.project_description}
            Location: ${request.project_details.location}
            Budget: ${request.project_details.starting_price || 'Not specified'}
            Timeline: ${request.project_details.timeline || 'Not specified'}
    
            MARKET ANALYSIS:
            Average Bid: $${avgBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            Bid Range: $${minBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${maxBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    
            TOP CONTRACTOR ANALYSIS:
            ${context}
    
            Provide a recommendation that includes:
            1. Your top pick and why (focus on value, not just lowest price)
            2. Any contractors to be cautious about and why
            3. Key questions the homeowner should ask
            4. Red flags to watch for during the hiring process
    
            Keep it conversational, helpful, and under 150 words. Include google ratings if they exist. Please include numerical results in your response to really highlight why you recommend a certain contractor as well as why you aren't as in favour of other contractors. Make sure to mention the sources of your ratings, and if you are going to mention things like "overall score", make sure you mention it is a score from your analysis that you used to assess these contractors.
        `;

        try {
            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert contractor recommendation assistant for Vendle. Provide practical, actionable advice to homeowners based on data analysis."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 400,
                temperature: 0.7
            });

            let recommendationString = response.choices[0].message.content?.trim() || '';

            // for (const contractorKey in contractorNumberToNameMap) {
            //     recommendationString = recommendationString.replace(
            //         new RegExp(contractorKey, 'g'),
            //         contractorNumberToNameMap[contractorKey]
            //     );
            // }

            return recommendationString;

        } catch (error) {
            console.error(error);

            const topContractor = profiles[0];
            return `Based on our analysis, I recommend **${topContractor.name}** (Overall Score: ${topContractor.overall_score.toFixed(2)}/1.0).`;
        }
    }

    /**
     * Helper function to calculate mean (replaces numpy.mean)
     */
    private _mean(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    }
}

// Export the classes and types
export { RecommendationEngine };
export type { AnalysisRequest, ProjectDetails, AnalysisResult, MarketAnalysis, Metadata };

// Example usage:
/*
import { RecommendationEngine } from './recommendation-engine';

const engine = new RecommendationEngine();

const request: AnalysisRequest = {
  contractor_bids: [
    {
      contractor_id: "123",
      contractor_name: "John's Plumbing",
      bid_amount: 5000,
      company_name: "John's Professional Plumbing Services",
      company_website: "https://example.com"
    }
  ],
  project_details: {
    project_type: "plumbing repair",
    project_description: "Fix leaky pipes",
    location: "Miami, FL",
    starting_price: 4500,
    timeline: "2 weeks"
  },
  analysis_depth: "standard"
};

const result = await engine.analyzeContractors(request);
console.log(result);
*/