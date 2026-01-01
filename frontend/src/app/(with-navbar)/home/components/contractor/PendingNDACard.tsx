import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, User, Calendar, AlertCircle } from "lucide-react";
import { PendingNDA } from "../types";
import { motion } from "framer-motion";

interface PendingNDACardProps {
  nda: PendingNDA;
  onReviewNDA: () => void;
}

export function PendingNDACard({ nda, onReviewNDA }: PendingNDACardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full shadow-lg border-2 border-[#D9D9D9] hover:border-[#4A637D]/50 hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden group">
        {/* Gradient overlay header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#4A637D]" />

        <CardHeader className="pb-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-[#D9D9D9]/30 shadow-sm">
                  <FileText className="h-4 w-4 text-[#4A637D]" />
                </div>
                <Badge className="bg-[#E0C9A6]/30 text-[#2C3E50] border-[#E0C9A6] shadow-sm">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Action Required
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mb-2 truncate group-hover:text-[#4A637D] transition-colors">
                {nda.projectTitle}
              </CardTitle>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#4A637D]" />
                <span className="line-clamp-2">{nda.address}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Info section */}
          <div className="space-y-3 p-4 rounded-xl bg-[#D9D9D9]/20 border border-[#D9D9D9]">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="font-medium">Homeowner</span>
              </div>
              <span className="font-semibold text-foreground">{nda.homeownerName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium">Requested</span>
              </div>
              <span className="font-semibold text-foreground">{new Date(nda.requestedDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Button
              variant="default"
              className="w-full bg-[#4A637D] hover:bg-[#4A637D]/90 shadow-md hover:shadow-lg transition-all font-bold"
              onClick={onReviewNDA}
            >
              <FileText className="h-4 w-4 mr-2" />
              Review & Sign NDA
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
