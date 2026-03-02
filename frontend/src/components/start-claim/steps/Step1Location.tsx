"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { US_STATES } from "@/lib/formatting";

interface Step1LocationProps {
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  onAddressChange: (address: { street: string; city: string; state: string; zip: string }) => void;
}

export function Step1Location({ address, onAddressChange }: Step1LocationProps) {
  const handleChange = (field: keyof typeof address, value: string) => {
    onAddressChange({
      ...address,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
        {/* Street Address */}
        <AddressAutocomplete
          className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none bg-white"
          value={address.street}
          onChange={(newAddress) => {
            onAddressChange({
              ...address,
              street: newAddress.street
            });
          }}
          placeholder="123 Main Street"
        />

        {/* City, State, Zip in grid */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
              City
            </Label>
            <Input
              className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="San Francisco"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
              State
            </Label>
            <Select
              value={address.state}
              onValueChange={(value) => handleChange('state', value)}
            >
              <SelectTrigger className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value} className="text-sm">
                    {state.value} - {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
              ZIP Code
            </Label>
            <Input
              className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
              value={address.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              placeholder="94102"
              maxLength={5}
            />
          </div>
      </div>
    </div>
  );
}
