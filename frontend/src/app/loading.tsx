import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="space-y-4 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-vendle-blue" />
        <p className="text-lg text-vendle-navy">Loading Vendle...</p>
      </div>
    </div>
  );
}
