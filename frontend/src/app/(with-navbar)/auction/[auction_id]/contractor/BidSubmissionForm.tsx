import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DollarSign, Clock, Info, ArrowRight, FileText, Upload, X, Calculator } from "lucide-react";
import { BidSubmissionFormProps } from "../types";

export function BidSubmissionForm({
  bidData,
  uploadedFile,
  onBidDataChange,
  onFileUpload,
  onSubmit,
  isSubmitting,
  fileInputRef,
  onFileClick,
  onFileRemove,
  disableSubmit
}: BidSubmissionFormProps) {
  return (
    <>
      {/* Header with gradient */}
      <div className="rounded-t-2xl bg-vendle-blue p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Submit Your Bid</h2>
          <Badge className="bg-white/20 text-white border-white/30">
            <Clock className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
        <p className="text-white/90 text-sm">
          Complete all fields and upload your detailed estimate
        </p>
      </div>

      {/* Form body */}
      <form onSubmit={onSubmit} className="bg-white rounded-b-2xl border-2 border-t-0 border-vendle-gray/20 p-6 space-y-6 shadow-xl">
        {/* Main bid amount - hero input */}
        <div className="p-6 rounded-xl bg-vendle-blue/5 border-2 border-vendle-blue/20">
          <Label className="text-base font-bold text-foreground mb-3 block flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-vendle-blue" />
            Total Bid Amount
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-vendle-blue">
              $
            </span>
            <Input
              type="number"
              name="amount"
              value={bidData.amount}
              onChange={onBidDataChange}
              className="h-16 pl-12 text-3xl font-bold border-2 border-vendle-blue/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 bg-white rounded-xl"
              placeholder="0"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            This is your total project cost
          </p>
        </div>

        {/* Cost breakdown - collapsible */}
        <Accordion type="single" collapsible>
          <AccordionItem value="breakdown" className="border-none">
            <AccordionTrigger className="py-3 px-4 hover:bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calculator className="w-4 h-4 text-vendle-blue" />
                Cost Breakdown (Optional)
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Materials
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      name="budgetTotal"
                      value={bidData.budgetTotal}
                      onChange={onBidDataChange}
                      className="h-11 pl-9 text-sm rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Labor Costs
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      name="laborCosts"
                      value={bidData.laborCosts}
                      onChange={onBidDataChange}
                      className="h-11 pl-9 text-sm rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Subcontractor Expenses
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      name="subContractorExpenses"
                      value={bidData.subContractorExpenses}
                      onChange={onBidDataChange}
                      className="h-11 pl-9 text-sm rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Overhead
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      name="overhead"
                      value={bidData.overhead}
                      onChange={onBidDataChange}
                      className="h-11 pl-9 text-sm rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Profit
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      name="profit"
                      value={bidData.profit}
                      onChange={onBidDataChange}
                      className="h-11 pl-9 text-sm rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Allowance
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      name="allowance"
                      value={bidData.allowance}
                      onChange={onBidDataChange}
                      className="h-11 pl-9 text-sm rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* File upload - enhanced */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-vendle-blue" />
            Detailed Estimate (PDF Required)
          </Label>

          {!uploadedFile ? (
            <div onClick={onFileClick} className="relative group cursor-pointer">
              <div className="rounded-xl border-2 border-dashed border-vendle-gray/50 hover:border-vendle-blue p-8 transition-all bg-vendle-blue/5 group-hover:bg-vendle-blue/10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-vendle-blue/10 group-hover:bg-vendle-blue/20 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-7 h-7 text-vendle-blue" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF only, max 10 MB</p>
                </div>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                onChange={onFileUpload}
                accept=".pdf"
                className="hidden"
              />
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-vendle-teal/10 border-2 border-vendle-teal/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-vendle-teal/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-vendle-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors group/remove"
                >
                  <X className="w-5 h-5 text-muted-foreground group-hover/remove:text-red-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit button with shimmer */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || disableSubmit}
          className="w-full h-14 rounded-xl bg-vendle-blue hover:shadow-2xl hover:shadow-vendle-blue/30 text-white font-bold text-lg transition-all group relative overflow-hidden"
        >
          <span className="relative z-10">
            {isSubmitting ? "Submitting..." : "Submit Bid"}
          </span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />

          {/* Shimmer effect */}
          {!isSubmitting && (
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </Button>
      </form>
    </>
  );
}
