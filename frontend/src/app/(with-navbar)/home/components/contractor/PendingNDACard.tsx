import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, FileText } from "lucide-react";
import { PendingNDA } from "../types";

interface PendingNDACardProps {
  nda: PendingNDA;
  onReviewNDA: () => void;
}

export function PendingNDACard({ nda, onReviewNDA }: PendingNDACardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{nda.projectTitle}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{nda.address}</span>
            </div>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Homeowner:</span>
              <span className="font-medium">{nda.homeownerName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Requested:</span>
              <span className="font-medium">{new Date(nda.requestedDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="pt-2">
            <Button
              variant="default"
              className="w-full bg-vendle-blue hover:bg-vendle-blue/90"
              onClick={onReviewNDA}
            >
              <FileText className="h-4 w-4 mr-2" />
              Review NDA
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
