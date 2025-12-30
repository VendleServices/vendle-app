"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="border-2 border-vendle-gray/30 shadow-md rounded-2xl">
      <CardContent className="p-8 lg:p-10">
        <div className="space-y-6">
          {/* Street Address */}
          <div>
            <AddressAutocomplete
              className="h-14 rounded-xl border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 text-base bg-white"
              value={address.street}
              onChange={(newAddress) => {
                // Merge the street value from autocomplete with existing address data
                onAddressChange({
                  ...address,
                  street: newAddress.street
                });
              }}
              placeholder="123 Main Street"
            />
          </div>

          {/* City, State, Zip in grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* City */}
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2.5">
                City
              </Label>
              <Input
                className="h-14 rounded-xl border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 text-base"
                value={address.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="San Francisco"
              />
            </div>

            {/* State */}
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2.5">
                State
              </Label>
              <Input
                className="h-14 rounded-xl border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 text-base"
                value={address.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="CA"
                maxLength={2}
              />
            </div>

            {/* ZIP Code */}
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2.5">
                ZIP Code
              </Label>
              <Input
                className="h-14 rounded-xl border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 text-base"
                value={address.zip}
                onChange={(e) => handleChange('zip', e.target.value)}
                placeholder="94102"
                maxLength={5}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
