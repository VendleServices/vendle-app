import React from 'react';
import Image from 'next/image';

const bids = [
  {
    contractor: 'Reliable Roofers',
    bidAmount: 12000,
    materials: 'GAF Timberline HDZ',
    warranty: '25-year limited warranty',
    timeline: '2 weeks',
    notes: 'Includes debris removal and magnetic sweep.',
    imageUrl: '/placeholder.svg'
  },
  {
    contractor: 'Top Tier Contracting',
    bidAmount: 13500,
    materials: 'Owens Corning Duration',
    warranty: '50-year platinum warranty',
    timeline: '10 days',
    notes: 'Includes extended warranty and gutter cleaning.',
    imageUrl: '/placeholder.svg'
  },
  {
    contractor: 'Affordable Exteriors',
    bidAmount: 11000,
    materials: 'CertainTeed Landmark',
    warranty: '10-year workmanship warranty',
    timeline: '3 weeks',
    notes: 'Lowest cost option, basic service.',
    imageUrl: '/placeholder.svg'
  }
];

const SmartBidComparison = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-foreground">Smart Bid Comparison</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
        {bids?.map((bid, index) => (
          <div key={index} className="bg-card p-4 sm:p-5 lg:p-6 rounded-2xl border border-border/50 shadow-subtle hover:shadow-strong hover:border-primary/20 transition-all duration-200 flex flex-col items-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4">
              <Image 
                src={bid.imageUrl} 
                alt={`${bid.contractor} logo`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">{bid.contractor}</h2>
            <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-primary">${bid.bidAmount.toLocaleString()}</p>
            <div className="space-y-2 text-sm sm:text-base text-card-foreground text-center">
              <p><strong>Materials:</strong> {bid.materials}</p>
              <p><strong>Warranty:</strong> {bid.warranty}</p>
              <p><strong>Timeline:</strong> {bid.timeline}</p>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm"><em>{bid.notes}</em></p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-4 sm:p-5 lg:p-6 rounded-2xl border border-border/50 shadow-subtle hover:shadow-medium transition-all duration-200">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-card-foreground">AI-Powered Analysis</h2>
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-card-foreground">
          <p>
            Based on the provided bids, <strong>Top Tier Contracting</strong> offers the best overall value. Although their bid is the highest, the 50-year platinum warranty and shorter timeline provide significant long-term benefits and convenience.
          </p>
          <p>
            <strong>Reliable Roofers</strong> is a solid mid-range option with good materials and a respectable warranty.
          </p>
          <p>
            <strong>Affordable Exteriors</strong> is the most budget-friendly choice, but the shorter warranty and longer timeline might pose risks for long-term durability and satisfaction.
          </p>
          <p className="mt-4 font-semibold text-primary">
            Recommendation: For maximum peace of mind and quality, Top Tier Contracting is the recommended choice. If budget is the primary concern, Reliable Roofers presents a balanced option.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartBidComparison; 