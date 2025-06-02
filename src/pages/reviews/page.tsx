"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Filter, ArrowUpDown, Calendar, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Review {
    id: string;
    rating: number;
    comment: string;
    reviewer_name: string;
    reviewer_role: string;
    date: string;
    project_type: string;
    project_address: string;
    response?: string;
    response_date?: string;
}

export default function ReviewsPage() {
    const [sortBy, setSortBy] = useState('date-desc');
    const [filterBy, setFilterBy] = useState('all');
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: "1",
            rating: 5,
            comment: "Exceptional work on our water damage restoration project. The team was professional, thorough, and completed the job ahead of schedule. Their attention to detail and communication throughout the process was outstanding. Would highly recommend!",
            reviewer_name: "Sarah Johnson",
            reviewer_role: "Homeowner",
            date: "2024-03-15",
            project_type: "Water Damage Restoration",
            project_address: "123 Oak Street, Portland, OR",
            response: "Thank you for your kind words, Sarah! We're thrilled to hear that our team exceeded your expectations. It was a pleasure working with you on your restoration project.",
            response_date: "2024-03-16"
        },
        {
            id: "2",
            rating: 4,
            comment: "Good work on the fire damage cleanup. The team was responsive and professional. The only reason for 4 stars instead of 5 is that the timeline was slightly longer than initially estimated. However, the quality of work was excellent.",
            reviewer_name: "Michael Chen",
            reviewer_role: "Property Manager",
            date: "2024-03-10",
            project_type: "Fire Damage Restoration",
            project_address: "456 Pine Avenue, Seattle, WA",
            response: "Thank you for your feedback, Michael. We appreciate your understanding regarding the timeline extension, which was necessary to ensure the highest quality of work. We're glad you were satisfied with the results.",
            response_date: "2024-03-11"
        },
        {
            id: "3",
            rating: 5,
            comment: "Outstanding service! The team handled our mold remediation project with expertise and care. They were very thorough in explaining the process and kept us updated throughout. The final result exceeded our expectations.",
            reviewer_name: "Emily Rodriguez",
            reviewer_role: "Homeowner",
            date: "2024-03-05",
            project_type: "Mold Remediation",
            project_address: "789 Maple Drive, San Francisco, CA"
        },
        {
            id: "4",
            rating: 5,
            comment: "The team did an amazing job with our storm damage repairs. They were quick to respond, professional, and completed the work to the highest standard. Very impressed with their attention to detail and customer service.",
            reviewer_name: "David Thompson",
            reviewer_role: "Business Owner",
            date: "2024-02-28",
            project_type: "Storm Damage Repair",
            project_address: "321 Cedar Lane, Denver, CO",
            response: "Thank you for your positive review, David! We're glad we could help restore your business property quickly and efficiently. Your satisfaction is our top priority.",
            response_date: "2024-02-29"
        },
        {
            id: "5",
            rating: 5,
            comment: "Incredible work on our basement flood restoration. The team was available 24/7 and handled everything with professionalism. They went above and beyond to ensure our home was restored to its original condition.",
            reviewer_name: "Jennifer Martinez",
            reviewer_role: "Homeowner",
            date: "2024-02-20",
            project_type: "Flood Damage Restoration",
            project_address: "567 Elm Court, Chicago, IL"
        }
    ]);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [responseText, setResponseText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const getAverageRating = () => {
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };
        reviews.forEach(review => {
            distribution[review.rating as keyof typeof distribution]++;
        });
        return distribution;
    };

    const handleRespondClick = (review: Review) => {
        setSelectedReview(review);
        setResponseText("");
        setIsDialogOpen(true);
    };

    const handleSubmitResponse = () => {
        if (!selectedReview || !responseText.trim()) return;

        const updatedReviews = reviews.map(review => {
            if (review.id === selectedReview.id) {
                return {
                    ...review,
                    response: responseText,
                    response_date: new Date().toISOString().split('T')[0]
                };
            }
            return review;
        });

        setReviews(updatedReviews);
        setIsDialogOpen(false);
        toast({
            title: "Response Submitted",
            description: "Your response has been successfully added to the review.",
        });
    };

    const ratingDistribution = getRatingDistribution();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-50 p-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage and respond to customer reviews</p>
                    </div>
                    <div className="flex gap-4">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-desc">Newest First</SelectItem>
                                <SelectItem value="date-asc">Oldest First</SelectItem>
                                <SelectItem value="rating-desc">Highest Rating</SelectItem>
                                <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterBy} onValueChange={setFilterBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reviews</SelectItem>
                                <SelectItem value="5">5 Stars</SelectItem>
                                <SelectItem value="4">4 Stars</SelectItem>
                                <SelectItem value="3">3 Stars</SelectItem>
                                <SelectItem value="2">2 Stars</SelectItem>
                                <SelectItem value="1">1 Star</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Stats Card */}
                    <Card className="lg:col-span-1">
                        <CardContent className="p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-4xl font-bold text-gray-900 mb-2">{getAverageRating()}</h2>
                                <div className="flex justify-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i < Math.round(Number(getAverageRating()))
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">{reviews.length} total reviews</p>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
                                    <div key={rating} className="flex items-center">
                                        <span className="text-sm text-gray-600 w-8">{rating} stars</span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                            <div
                                                className="h-2 bg-yellow-400 rounded-full"
                                                style={{
                                                    width: `${(count / reviews.length) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews List */}
                    <div className="lg:col-span-3 space-y-6">
                        {reviews.map((review) => (
                            <Card key={review.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{review.project_type}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {review.project_address}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < review.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>

                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <Avatar className="w-8 h-8 mr-2">
                                                <AvatarFallback>
                                                    {review.reviewer_name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                                                <p className="text-xs">{review.reviewer_role}</p>
                                            </div>
                                        </div>
                                        <p>{new Date(review.date).toLocaleDateString()}</p>
                                    </div>

                                    {review.response ? (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-medium text-gray-900">Your Response</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(review.response_date!).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p className="text-gray-700">{review.response}</p>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end">
                                            <Button 
                                                variant="outline" 
                                                className="text-sm"
                                                onClick={() => handleRespondClick(review)}
                                            >
                                                Respond to Review
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Response Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Respond to Review</DialogTitle>
                        <DialogDescription>
                            Write a response to {selectedReview?.reviewer_name}'s review about their {selectedReview?.project_type} project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Type your response here..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            className="min-h-[150px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitResponse}>
                            Submit Response
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
} 