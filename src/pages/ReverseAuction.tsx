"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, DollarSign, Clock, Users, MapPin } from 'lucide-react';

interface Auction {
    auction_id: string;
    claim_id: string;
  title: string;
    status: string;
    starting_bid: number;
    current_bid: number;
    bid_count: number;
    end_date: string;
    property_address: string;
    project_type: string;
    design_plan: string;
  description: string;
}

export default function ReverseAuction() {
  const { user } = useAuth();
    const { toast } = useToast();
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
    const [bidding, setBidding] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const response = await fetch('/api/auctions');
            if (!response.ok) {
                throw new Error('Failed to fetch auctions');
            }
            const data = await response.json();
            
            // Filter for active auctions (status is 'open' and end date is in the future)
            const activeAuctions = data.filter((auction: Auction) => {
                const endDate = new Date(auction.end_date);
                return auction.status === 'open' && endDate > new Date();
            });
            
            setAuctions(activeAuctions);
        } catch (error) {
            console.error('Error fetching auctions:', error);
            toast({
                title: "Error",
                description: "Failed to load auctions. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBidChange = (auctionId: string, value: string) => {
    setBidAmounts(prev => ({
      ...prev,
            [auctionId]: parseFloat(value) || 0
    }));
  };

    const handleSubmitBid = async (auction: Auction) => {
        if (!bidAmounts[auction.auction_id]) {
            toast({
                title: "Invalid Bid",
                description: "Please enter a valid bid amount",
                variant: "destructive",
            });
            return;
        }

        // Convert both numbers to strings to avoid floating point precision issues
        const currentBid = auction.current_bid.toString();
        const newBid = bidAmounts[auction.auction_id].toString();

        if (parseFloat(newBid) >= parseFloat(currentBid)) {
            toast({
                title: "Invalid Bid",
                description: "Your bid must be lower than the current bid",
                variant: "destructive",
            });
            return;
        }

        setBidding(prev => ({ ...prev, [auction.auction_id]: true }));

        try {
            const response = await fetch('/api/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    auction_id: auction.auction_id,
                    contractor_id: user?.user_id,
                    amount: parseFloat(newBid),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit bid');
            }

            toast({
                title: "Success",
                description: "Your bid has been submitted successfully",
            });

            // Refresh auctions to get updated bid information
            fetchAuctions();
        } catch (error) {
            console.error('Error submitting bid:', error);
            toast({
                title: "Error",
                description: "Failed to submit bid. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setBidding(prev => ({ ...prev, [auction.auction_id]: false }));
        }
    };

    const getTimeRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-vendle-blue" />
            </div>
        );
    }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-vendle-navy mb-2">
          Welcome, {user?.name || 'Contractor'}
        </h1>
        <p className="text-vendle-navy/70">
          Browse available projects and submit your bids
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No active auctions available at the moment</p>
                    </div>
                ) : (
                    auctions.map((auction) => (
                        <Card key={auction.auction_id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-vendle-navy">
                                        {auction.title}
                </CardTitle>
                                    <Badge className="bg-green-100 text-green-800">
                                        Active
                </Badge>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800">
                                        {auction.bid_count} Bids
                </Badge>
                <Badge className="bg-vendle-navy text-white">
                                        ${auction.current_bid.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center text-sm text-vendle-navy/70">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{auction.property_address}</span>
                                    </div>
                                    <p className="text-sm text-vendle-navy/70">{auction.description}</p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            <span>Starting Bid: ${auction.starting_bid.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>{getTimeRemaining(auction.end_date)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-vendle-navy">Your Bid:</span>
                    <Input
                      type="number"
                                                value={bidAmounts[auction.auction_id] || ''}
                                                onChange={(e) => handleBidChange(auction.auction_id, e.target.value)}
                      className="w-32"
                      placeholder="Amount"
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmitBid(auction)}
                    className="w-full bg-vendle-navy text-white hover:bg-vendle-navy/90"
                    disabled={!bidAmounts[auction.auction_id] || 
                             parseFloat(bidAmounts[auction.auction_id].toString()) >= parseFloat(auction.current_bid.toString()) ||
                             bidding[auction.auction_id]}
                  >
                    {bidding[auction.auction_id] ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Bid'
                    )}
                  </Button>
                </div>
                                </div>
            </CardContent>
          </Card>
                    ))
                )}
      </div>
    </motion.div>
  );
} 