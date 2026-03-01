"use client";

import { Zap, Trash2, Home, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageUpload } from "../uploads/ImageUpload";

interface PropertyQuestions {
    hasFunctionalUtilities: boolean | null;
    hasDumpster: boolean | null;
    isOccupied: boolean | null;
}

interface ImageFile {
    file: File;
    preview: string;
}

interface Step4PropertyProps {
    questions: PropertyQuestions;
    onQuestionChange: (field: keyof PropertyQuestions, value: boolean) => void;
    images: ImageFile[];
    onImageUpload: (files: File[]) => void;
    onImageRemove: (index: number) => void;
}

export function Step4Property({
    questions,
    onQuestionChange,
    images,
    onImageUpload,
    onImageRemove
}: Step4PropertyProps) {
    const QuestionButton = ({
        selected,
        onClick,
        label
    }: {
        selected: boolean;
        onClick: () => void;
        label: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex-1 py-2 px-3 rounded border text-sm font-medium transition-colors",
                selected
                    ? "border-vendle-blue bg-vendle-blue/5 text-vendle-blue"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
            )}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-4">
            {/* Property Questions */}
            <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 rounded border border-gray-200 bg-white">
                    <Label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Functional utilities?
                    </Label>
                    <div className="flex gap-2">
                        <QuestionButton
                            selected={questions.hasFunctionalUtilities === true}
                            onClick={() => onQuestionChange("hasFunctionalUtilities", true)}
                            label="Yes"
                        />
                        <QuestionButton
                            selected={questions.hasFunctionalUtilities === false}
                            onClick={() => onQuestionChange("hasFunctionalUtilities", false)}
                            label="No"
                        />
                    </div>
                </div>

                <div className="p-3 rounded border border-gray-200 bg-white">
                    <Label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                        Dumpster available?
                    </Label>
                    <div className="flex gap-2">
                        <QuestionButton
                            selected={questions.hasDumpster === true}
                            onClick={() => onQuestionChange("hasDumpster", true)}
                            label="Yes"
                        />
                        <QuestionButton
                            selected={questions.hasDumpster === false}
                            onClick={() => onQuestionChange("hasDumpster", false)}
                            label="No"
                        />
                    </div>
                </div>

                <div className="p-3 rounded border border-gray-200 bg-white">
                    <Label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5" />
                        Property occupied?
                    </Label>
                    <div className="flex gap-2">
                        <QuestionButton
                            selected={questions.isOccupied === true}
                            onClick={() => onQuestionChange("isOccupied", true)}
                            label="Yes"
                        />
                        <QuestionButton
                            selected={questions.isOccupied === false}
                            onClick={() => onQuestionChange("isOccupied", false)}
                            label="No"
                        />
                    </div>
                </div>
            </div>

            {/* Image Upload Section */}
            <div className="p-4 rounded border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Property Images</span>
                    <span className="text-xs text-gray-400">(optional)</span>
                </div>

                <ImageUpload
                    images={images}
                    onUpload={onImageUpload}
                    onRemove={onImageRemove}
                    maxFiles={20}
                    accept="image/*"
                />
            </div>
        </div>
    );
}
