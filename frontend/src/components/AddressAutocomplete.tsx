"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface AddressAutocompleteProps {
    value: string;
    onChange: (address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    }) => void;
    className?: string;
    placeholder?: string;
    label?: string;
}

export function AddressAutocomplete({
    value,
    onChange,
    className = "",
    placeholder = "123 Main Street",
    label = "Street Address"
}: AddressAutocompleteProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only update street, preserve other fields by passing empty strings
        // The parent component will merge this with existing address state
        onChange({
            street: e.target.value,
            city: '',
            state: '',
            zip: ''
        });
    };

    return (
        <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {label}
            </Label>
            <Input
                value={value}
                onChange={handleChange}
                className={className}
                placeholder={placeholder}
            />
        </div>
    );
}

