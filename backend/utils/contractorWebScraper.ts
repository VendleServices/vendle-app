// contractor-scraper.ts
import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import { config } from 'dotenv';

config();

interface ContractorBid {
    contractor_id: string;
    contractor_name: string;
    bid_amount: number;
    bid_description?: string;
    phone_number?: string;
    email?: string;
    company_name?: string;
    company_website?: string;
    license_number?: string;
    years_experience?: number;
}

interface Review {
    rating: number;
    text: string;
    date: string;
    source: string;
}

class ContractorProfile {
    contractor_id: string;
    name: string;
    company_name: string;
    overall_score: number;
    rating: number | null;
    review_count: number | null;
    years_in_business: number | null;
    license_verified: boolean;
    insurance_verified: boolean;
    bbb_rating: string | null;
    specialties: string[];
    recent_reviews: Review[];
    pricing_competitiveness: number | null;
    response_reliability: number | null;
    red_flags: string[];
    green_flags: string[];
    confidence_score: number;
    data_sources: string[];

    constructor({
                    contractor_id,
                    name,
                    company_name,
                    overall_score = 0.0,
                    rating = null,
                    review_count = null,
                    years_in_business = null,
                    license_verified = false,
                    insurance_verified = false,
                    bbb_rating = null,
                    specialties = [],
                    recent_reviews = [],
                    pricing_competitiveness = null,
                    response_reliability = null,
                    red_flags = [],
                    green_flags = [],
                    confidence_score = 0.0,
                    data_sources = []
                }: {
        contractor_id: string;
        name: string;
        company_name: string;
        overall_score?: number;
        rating?: number | null;
        review_count?: number | null;
        years_in_business?: number | null;
        license_verified?: boolean;
        insurance_verified?: boolean;
        bbb_rating?: string | null;
        specialties?: string[];
        recent_reviews?: Review[];
        pricing_competitiveness?: number | null;
        response_reliability?: number | null;
        red_flags?: string[];
        green_flags?: string[];
        confidence_score?: number;
        data_sources?: string[];
    }) {
        this.contractor_id = contractor_id;
        this.name = name;
        this.company_name = company_name;
        this.overall_score = overall_score;
        this.rating = rating;
        this.review_count = review_count;
        this.years_in_business = years_in_business;
        this.license_verified = license_verified;
        this.insurance_verified = insurance_verified;
        this.bbb_rating = bbb_rating;
        this.specialties = specialties;
        this.recent_reviews = recent_reviews;
        this.pricing_competitiveness = pricing_competitiveness;
        this.response_reliability = response_reliability;
        this.red_flags = red_flags;
        this.green_flags = green_flags;
        this.confidence_score = confidence_score;
        this.data_sources = data_sources;
    }

    toJSON(): Record<string, any> {
        return { ...this };
    }
}

class ContractorWebScraper {
    private sessionTimeout: number;
    private maxRetries: number;
    private headers: Record<string, string>;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.sessionTimeout = 30000; // 30 seconds in milliseconds
        this.maxRetries = 3;
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        };

        // Create axios instance with default config
        this.axiosInstance = axios.create({
            timeout: this.sessionTimeout,
            headers: this.headers,
            httpsAgent: new https.Agent({
                rejectUnauthorized: true
            })
        });
    }

    /**
     * Main method to analyze a contractor
     * Event loop is SCHEDULER in async/await
     * It keeps track of ALL promises
     * It runs async functions until they hit an await
     * When something an await was waiting on is ready, the event loop resumes the function
     * Yielding control (when an await is hit) means function pauses so others can run
     */
    async analyzeContractor(contractor: ContractorBid, projectType: string, location: string): Promise<ContractorProfile> {
        // Initialize the profile
        const profile = new ContractorProfile({
            contractor_id: contractor.contractor_id,
            name: contractor.contractor_name || "",
            company_name: contractor.company_name || contractor.contractor_name || "",
        });

        // Build a list of promises - functions are called, they return promises (not executed to completion yet)
        const tasks = [
            this.analyzeWebsite(contractor, profile),
            this.searchGoogleBusiness(contractor, profile, location),
            this.searchBBB(contractor, profile),
            this.searchReviewPlatforms(contractor, profile),
            this.verifyCredentials(contractor, profile, location),
        ];

        try {
            // Schedule all promises to run concurrently
            // Wait until all finish
            // await causes this function (analyzeContractor) to suspend until all subtasks complete
            // Promise.allSettled runs multiple promises concurrently and waits for ALL to complete
            // Returns results in same order as input list
            // await suspends the whole function till all results are returned, event loop can run other tasks in that time
            await Promise.allSettled(tasks);
        } catch (error) {
            console.error('Error during contractor analysis:', error);
        }

        // Calculate overall contractor profile metrics
        this.calculateScores(profile, contractor, projectType);

        return profile;
    }

    /**
     * Analyze contractor's website
     */
    async analyzeWebsite(contractor: ContractorBid, profile: ContractorProfile): Promise<void> {
        const companyWebsite = contractor.company_website;
        if (!companyWebsite) {
            return;
        }

        try {
            // Try to get the company webpage with axios
            const response = await this.axiosInstance.get(companyWebsite);

            if (response.status === 200) {
                // Parse the retrieved html webpage
                const $ = cheerio.load(response.data);
                profile.data_sources.push("contractor_website");

                // Extract company information
                this._extractCompanyInfo($, profile);
                this._extractServices($, profile);
                this._checkCredentialsMentions($, profile);

                console.log("Analyzed website of contractor");
            }
        } catch (error) {
            console.error("Error analyzing contractor website");
        }
    }

    /**
     * Search Google Business and reviews
     */
    async searchGoogleBusiness(contractor: ContractorBid, profile: ContractorProfile, location: string): Promise<void> {
        try {
            if (process.env.GOOGLE_PLACES_API_KEY) {
                // Use Google Places API if it's available
                await this._googlePlacesApiSearch(contractor, profile, location);
            } else {
                // Just do a normal Google search
                await this._googleWebSearch(contractor, profile, location);
            }
        } catch (error) {
            console.error("Error searching Google business");
        }
    }

    /**
     * Use Google Places API for business data
     */
    async _googlePlacesApiSearch(contractor: ContractorBid, profile: ContractorProfile, location: string): Promise<void> {
        try {
            const apiKey = process.env.GOOGLE_PLACES_API_KEY;
            const searchQuery = `${contractor.contractor_name || ""} ${contractor.company_name || ""} ${location || ""}`;

            // Text search
            const searchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
            const params = {
                query: searchQuery,
                key: apiKey,
                fields: 'place_id,name,rating,user_ratings_total,formatted_address,business_status'
            };

            const response = await this.axiosInstance.get(searchUrl, { params });
            const data = response.data;

            if (data.results && data.results.length > 0) {
                const place = data.results[0];
                profile.rating = place.rating || null;
                profile.review_count = place.user_ratings_total || null;
                profile.data_sources.push("google_places_api");

                if (profile.rating && profile.rating >= 4.5) {
                    profile.green_flags.push(`Excellent Google rating: ${profile.rating}`);
                } else if (profile.rating && profile.rating < 3.5) {
                    profile.red_flags.push(`Low Google rating: ${profile.rating}`);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Google web search fallback
     */
    async _googleWebSearch(contractor: ContractorBid, profile: ContractorProfile, location: string): Promise<void> {
        console.log("Google web search");
    }

    /**
     * Search Better Business Bureau
     */
    async searchBBB(contractor: ContractorBid, profile: ContractorProfile): Promise<void> {
        console.log("BBB search");
    }

    /**
     * Search review platforms (Yelp, Angie's List, etc.)
     */
    async searchReviewPlatforms(contractor: ContractorBid, profile: ContractorProfile): Promise<void> {
        console.log("Review platform search");
    }

    /**
     * Verify credentials and insurance
     */
    async verifyCredentials(contractor: ContractorBid, profile: ContractorProfile, location: string): Promise<void> {
        console.log("Credential verification search");
    }

    /**
     * Extract company info from the parsed HTML website
     */
    private _extractCompanyInfo($: cheerio.CheerioAPI, profile: ContractorProfile): void {
        const text = $.text().toLowerCase();

        const yearsPatterns = [
            /(\d+)\+?\s*years?\s*(of\s*)?(experience|in\s*business|established)/i,
            /established\s*(\d{4})/i,
            /since\s*(\d{4})/i
        ];

        const currentYear = new Date().getFullYear();

        for (const pattern of yearsPatterns) {
            const match = text.match(pattern);
            if (match) {
                const years = parseInt(match[1]);
                if (years > 1900) {
                    profile.years_in_business = currentYear - years;
                } else {
                    profile.years_in_business = years;
                }
                break;
            }
        }
    }

    /**
     * Extract services from the parsed HTML website
     */
    private _extractServices($: cheerio.CheerioAPI, profile: ContractorProfile): void {
        const text = $.text().toLowerCase();

        const serviceCategories: Record<string, string[]> = {
            'plumbing': ['plumbing', 'plumber', 'pipe', 'drain', 'water heater', 'faucet'],
            'electrical': ['electrical', 'electrician', 'wiring', 'outlet', 'panel', 'lighting'],
            'hvac': ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'ac repair'],
            'roofing': ['roofing', 'roof', 'shingle', 'gutter', 'siding'],
            'general_construction': ['construction', 'renovation', 'remodeling', 'contractor'],
            'painting': ['painting', 'paint', 'interior', 'exterior'],
            'flooring': ['flooring', 'hardwood', 'tile', 'carpet', 'laminate'],
            'landscaping': ['landscaping', 'lawn', 'garden', 'irrigation', 'tree']
        };

        for (const [category, keywords] of Object.entries(serviceCategories)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                const formattedCategory = category.replace('_', ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                profile.specialties.push(formattedCategory);
            }
        }
    }

    /**
     * Check for contractor credentials
     */
    private _checkCredentialsMentions($: cheerio.CheerioAPI, profile: ContractorProfile): void {
        const text = $.text().toLowerCase();

        const credentialKeywords: Record<string, string> = {
            'licensed': 'Mentions being licensed',
            'insured': 'Mentions insurance coverage',
            'bonded': 'Mentions being bonded',
            'certified': 'Claims certifications',
            'accredited': 'Claims accreditation',
            'bbb': 'BBB member mentioned'
        };

        for (const [keyword, flag] of Object.entries(credentialKeywords)) {
            if (text.includes(keyword)) {
                profile.green_flags.push(flag);
            }
        }
    }

    /**
     * Calculate overall scores and metrics
     */
    calculateScores(profile: ContractorProfile, contractor: ContractorBid, projectType: string): void {
        // Calculate confidence score based on data sources
        const confidenceWeights: Record<string, number> = {
            'contractor_website': 0.15,
            'google_places_api': 0.25,
            'google_search': 0.20,
            'bbb': 0.15,
            'license_verification': 0.20,
            'review_platforms': 0.05,
        };

        // The more data sources studied, the higher the profile confidence score
        profile.confidence_score = profile.data_sources.reduce((sum, source) => {
            return sum + (confidenceWeights[source] || 0.05);
        }, 0);

        // Calculate contractor overall score
        const scoreComponents: Record<string, number> = {
            rating: this._ratingScore(profile.rating),
            experience: this._experienceScore(profile.years_in_business),
            specialization: this._specializationScore(profile.specialties, projectType),
            credentials: this._credentialScore(profile),
            reputation: this._reputationScore(profile),
        };

        const weights: Record<string, number> = {
            rating: 0.25,
            experience: 0.20,
            specialization: 0.25,
            credentials: 0.15,
            reputation: 0.15
        };

        profile.overall_score = Object.keys(scoreComponents).reduce((sum, component) => {
            return sum + (scoreComponents[component] * weights[component]);
        }, 0);

        // Adjust score based on red flags
        const redFlagPenalty = profile.red_flags.length * 0.05;
        profile.overall_score = Math.max(0.0, profile.overall_score - redFlagPenalty);
    }

    private _ratingScore(rating: number | null = null): number {
        if (!rating) {
            return 0.5; // neutral score for unknown rating
        }
        return Math.min(rating / 5.0, 1.0);
    }

    private _experienceScore(years: number | null = null): number {
        if (!years) {
            return 0.3; // low score for unknown experience
        }
        return Math.min(years / 10.0, 1.0);
    }

    private _specializationScore(specialties: string[], projectType: string): number {
        if (!specialties || specialties.length === 0) {
            return 0.3;
        }

        // Check if the contractor specializes in this project type
        const projectKeywords = projectType.toLowerCase().split(/\s+/);
        const specialtyText = specialties.join(' ').toLowerCase();

        const matches = projectKeywords.filter(keyword =>
            specialtyText.includes(keyword)
        ).length;

        return Math.min(matches / projectKeywords.length + 0.3, 1.0);
    }

    private _credentialScore(profile: ContractorProfile): number {
        let score = 0.0;
        if (profile.license_verified) {
            score += 0.4;
        }
        if (profile.insurance_verified) {
            score += 0.3;
        }
        if (['A+', 'A', 'A-'].includes(profile.bbb_rating || '')) {
            score += 0.3;
        }
        return Math.min(score, 1.0);
    }

    private _reputationScore(profile: ContractorProfile): number {
        const greenScore = profile.green_flags.length * 0.1;
        const redPenalty = profile.red_flags.length * 0.15;
        return Math.max(0.0, Math.min(greenScore - redPenalty + 0.5, 1.0));
    }
}

// Export the classes
export { ContractorWebScraper, ContractorProfile };
export type { ContractorBid, Review };

// Example usage:
/*
import { ContractorWebScraper } from './contractor-scraper';

const scraper = new ContractorWebScraper();

const contractor: ContractorBid = {
  contractor_id: "123",
  contractor_name: "John's Plumbing",
  company_name: "John's Professional Plumbing Services",
  company_website: "https://example.com"
};

const profile = await scraper.analyzeContractor(
  contractor,
  "plumbing repair",
  "Miami, FL"
);

console.log(profile);
*/