import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, DollarSign, Clock, Star, Mail, Phone } from 'lucide-react';

interface Auction {
  auction_id: string;
  title: string;
  description: string;
  starting_bid: number;
  current_bid: number;
  bid_count: number;
  end_date: string;
  status: string;
  property_address?: string;
  project_type?: string;
  design_plan?: string;
}

interface Bid {
  bid_id: string;
  amount: number;
  contractor_name: string;
  created_at: string;
  bidder_rating?: number;
  bidder_reviews?: number;
  bidder_company?: string;
  bidder_email?: string;
  bidder_phone?: string;
}

export default function AuctionDetailsPage() {
  const { auction_id } = useParams<{ auction_id: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(true);

  useEffect(() => {
    if (!auction_id) return;
    setLoading(true);
    fetch(`/api/auctions`)
      .then(res => res.json())
      .then((data: Auction[]) => {
        const found = data.find(a => a.auction_id.toString() === auction_id.toString());
        setAuction(found || null);
      })
      .finally(() => setLoading(false));
  }, [auction_id]);

  useEffect(() => {
    if (!auction_id) return;
    setBidsLoading(true);
    fetch(`/api/bids?auction_id=${auction_id}`)
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBids(data.map(bid => ({
            ...bid,
            contractor_name: bid.contractor_name || bid.name || bid.username || 'Unknown',
          })));
        } else if (Array.isArray(data.bids)) {
          setBids(data.bids.map(bid => ({
            ...bid,
            contractor_name: bid.contractor_name || bid.name || bid.username || 'Unknown',
          })));
        } else {
          setBids([]);
        }
      })
      .finally(() => setBidsLoading(false));
  }, [auction_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-vendle-blue" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Auction not found.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-vendle-navy">{auction.title}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-blue-100 text-blue-800">{auction.bid_count} Bids</Badge>
            <Badge className="bg-vendle-navy text-white">${auction.current_bid.toLocaleString()}</Badge>
            <Badge className="bg-green-100 text-green-800">{auction.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-gray-700">{auction.description}</div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                <span>Starting Bid: <span className="font-medium">${auction.starting_bid.toLocaleString()}</span></span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span>Ends: {new Date(auction.end_date).toLocaleString()}</span>
              </div>
              {auction.property_address && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">Address: {auction.property_address}</span>
                </div>
              )}
              {auction.project_type && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">Project Type: {auction.project_type}</span>
                </div>
              )}
              {auction.design_plan && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">Design Plan: {auction.design_plan}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-vendle-navy">Bidders Overview</CardTitle>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md"
                onChange={(e) => {
                  const sortedBids = [...bids].sort((a, b) => {
                    switch (e.target.value) {
                      case 'lowest_bid':
                        return a.amount - b.amount;
                      case 'highest_rating':
                        return (b.bidder_rating || 0) - (a.bidder_rating || 0);
                      case 'most_reviews':
                        return (b.bidder_reviews || 0) - (a.bidder_reviews || 0);
                      case 'company_name':
                        return (a.bidder_company || '').localeCompare(b.bidder_company || '');
                      default:
                        return 0;
                    }
                  });
                  setBids(sortedBids);
                }}
              >
                <option value="lowest_bid">Sort by Lowest Bid</option>
                <option value="highest_rating">Sort by Highest Rating</option>
                <option value="most_reviews">Sort by Most Reviews</option>
                <option value="company_name">Sort by Company Name</option>
              </select>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/bids/seed', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ auction_id }),
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to seed bids');
                    }
                    
                    setBidsLoading(true);
                    const bidsResponse = await fetch(`/api/bids?auction_id=${auction_id}`);
                    const bidsData = await bidsResponse.json();
                    
                    if (Array.isArray(bidsData)) {
                      setBids(bidsData);
                    } else if (Array.isArray(bidsData.bids)) {
                      setBids(bidsData.bids);
                    }
                  } catch (error) {
                    console.error('Error seeding bids:', error);
                  } finally {
                    setBidsLoading(false);
                  }
                }}
              >
                Add Test Bids
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bidsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-vendle-blue" />
            </div>
          ) : bids.length === 0 ? (
            <div className="text-gray-500 py-8">No bids yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bids.map((bid) => (
                <Card key={bid.bid_id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* Company Info */}
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-semibold">
                          {bid.bidder_company?.[0] || bid.contractor_name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{bid.bidder_company || 'Independent Contractor'}</h3>
                        <p className="text-sm text-muted-foreground">{bid.contractor_name}</p>
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    {bid.bidder_rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (bid.bidder_rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {bid.bidder_rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({bid.bidder_reviews} reviews)
                        </span>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{bid.bidder_email}</span>
                      </div>
                      {bid.bidder_phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{bid.bidder_phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Bid Amount */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Lowest Bid</p>
                          <p className="text-2xl font-bold text-vendle-navy">
                            ${bid.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button size="sm">
                            Accept Bid
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 