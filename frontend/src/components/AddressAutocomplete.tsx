"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        onChange({
            street: e.target.value,
            city: '',
            state: '',
            zip: ''
        });
    };

    return (
        <div>
            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
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
