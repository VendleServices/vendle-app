import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, FileText, Calendar, Building2 } from "lucide-react";

interface ClaimHeaderProps {
  claim: any;
  onBack: () => void;
}

export function ClaimHeader({ claim, onBack }: ClaimHeaderProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Top back button */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          className="h-9 rounded-full px-3 text-sm text-muted-foreground hover:bg-muted"
          onClick={onBack}
        >
          ← Back to Home
        </Button>
      </div>

      {/* Enhanced header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-vendle-gray/20 shadow-xl mb-8">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A637D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Title & metadata */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="uppercase tracking-wider text-xs font-bold text-vendle-blue border-vendle-blue/30 bg-vendle-blue/5">
                  <Building2 className="w-3 h-3 mr-1" />
                  Project Details
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {claim.street}, {claim.city}
              </h1>

              {claim.projectType && (
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  <FileText className="w-5 h-5 text-vendle-blue" />
                  <span>{claim.projectType}</span>
                </div>
              )}
            </div>

            {/* Right: Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
              {/* Location */}
              <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-vendle-gray/30 shadow-md">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wide font-medium">Location</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {claim.city}, {claim.state}
                </p>
              </div>

              {/* Created date */}
              <div className="p-4 rounded-xl bg-vendle-blue/10 border border-vendle-blue/20 shadow-md">
                <div className="flex items-center gap-2 text-vendle-blue text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wide font-medium">Created</span>
                </div>
                <p className="text-lg font-bold text-vendle-blue">
                  {formatDate(claim.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
