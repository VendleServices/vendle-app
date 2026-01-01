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
                "flex-1 p-5 rounded-xl border-2 transition-all font-semibold",
                selected
                    ? "border-vendle-blue bg-gradient-to-br from-vendle-blue/10 to-vendle-teal/5 shadow-lg shadow-vendle-blue/20 text-vendle-blue"
                    : "border-vendle-gray/40 hover:border-vendle-blue/50 bg-card hover:bg-vendle-blue/5 text-foreground"
            )}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-8">
            {/* Property Questions */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Functional Utilities */}
                <div className="p-6 rounded-xl bg-white border-2 border-vendle-gray/30">
                    <Label className="text-lg font-semibold text-foreground mb-4 block flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-vendle-blue/10">
                            <Zap className="w-5 h-5 text-vendle-blue" />
                        </div>
                        Is there functional electricity and water?
                    </Label>
                    <div className="flex gap-4">
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

                {/* Dumpster */}
                <div className="p-6 rounded-xl bg-white border-2 border-vendle-gray/30">
                    <Label className="text-lg font-semibold text-foreground mb-4 block flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-vendle-teal/10">
                            <Trash2 className="w-5 h-5 text-vendle-teal" />
                        </div>
                        Is there a dumpster within the immediate area?
                    </Label>
                    <div className="flex gap-4">
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

                {/* Occupancy */}
                <div className="p-6 rounded-xl bg-white border-2 border-vendle-gray/30">
                    <Label className="text-lg font-semibold text-foreground mb-4 block flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-vendle-sand/30">
                            <Home className="w-5 h-5 text-vendle-navy" />
                        </div>
                        Is the property occupied?
                    </Label>
                    <div className="flex gap-4">
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
            <div className="p-8 rounded-2xl bg-white border-2 border-vendle-gray/30">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-vendle-blue/10">
                        <ImageIcon className="w-6 h-6 text-vendle-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Property Images</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                    Upload photos of the property damage (optional)
                </p>

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
