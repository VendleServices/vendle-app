import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DollarSign, Clock, FileText, Upload, X, ChevronDown } from "lucide-react";
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
    <div className="bg-white border border-gray-200 rounded">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Submit Your Bid</h2>
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-vendle-teal/10 text-[10px] font-medium text-vendle-teal">
            <Clock className="w-3 h-3" />
            Live
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter your bid amount and upload your detailed estimate
        </p>
      </div>

      {/* Form body */}
      <form onSubmit={onSubmit} className="p-4 space-y-4">
        {/* Main bid amount */}
        <div className="p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
          <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Total Bid Amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-vendle-blue">
              $
            </span>
            <Input
              type="number"
              name="amount"
              value={bidData.amount}
              onChange={onBidDataChange}
              className="h-12 pl-8 text-lg font-semibold border-gray-200 focus:border-gray-400 focus:outline-none bg-white rounded transition-colors"
              placeholder="0"
              required
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5">
            Your total project cost including all expenses
          </p>
        </div>

        {/* Cost breakdown - collapsible */}
        <Accordion type="single" collapsible>
          <AccordionItem value="breakdown" className="border border-gray-200 rounded">
            <AccordionTrigger className="py-2.5 px-3 hover:bg-gray-50 text-sm font-medium text-gray-700 [&[data-state=open]>svg]:rotate-180">
              <span className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                Cost Breakdown (Optional)
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-500">
                    Materials
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      type="number"
                      name="budgetTotal"
                      value={bidData.budgetTotal}
                      onChange={onBidDataChange}
                      className="h-9 pl-7 text-sm rounded border-gray-200"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-500">
                    Labor Costs
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      type="number"
                      name="laborCosts"
                      value={bidData.laborCosts}
                      onChange={onBidDataChange}
                      className="h-9 pl-7 text-sm rounded border-gray-200"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-500">
                    Subcontractor
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      type="number"
                      name="subContractorExpenses"
                      value={bidData.subContractorExpenses}
                      onChange={onBidDataChange}
                      className="h-9 pl-7 text-sm rounded border-gray-200"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-500">
                    Overhead
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      type="number"
                      name="overhead"
                      value={bidData.overhead}
                      onChange={onBidDataChange}
                      className="h-9 pl-7 text-sm rounded border-gray-200"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-500">
                    Profit
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      type="number"
                      name="profit"
                      value={bidData.profit}
                      onChange={onBidDataChange}
                      className="h-9 pl-7 text-sm rounded border-gray-200"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-500">
                    Allowance
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      type="number"
                      name="allowance"
                      value={bidData.allowance}
                      onChange={onBidDataChange}
                      className="h-9 pl-7 text-sm rounded border-gray-200"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* File upload */}
        <div className="space-y-2">
          <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            Detailed Estimate (PDF Required)
          </Label>

          {!uploadedFile ? (
            <div onClick={onFileClick} className="cursor-pointer">
              <div className="rounded border border-dashed border-gray-300 hover:border-vendle-blue p-4 transition-colors bg-gray-50 hover:bg-vendle-blue/5">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-0.5">
                    Click to upload
                  </p>
                  <p className="text-[10px] text-gray-500">PDF only, max 10 MB</p>
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
            <div className="p-3 rounded bg-vendle-teal/5 border border-vendle-teal/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-vendle-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="p-1.5 rounded hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting || disableSubmit}
          className="w-full h-10 rounded bg-vendle-blue hover:bg-vendle-blue/90 text-white text-sm font-medium"
        >
          {isSubmitting ? "Submitting..." : "Submit Bid"}
        </Button>
      </form>
    </div>
  );
}
