"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapProps = {
    address: string;
}

const Map = ({ address } : MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        async function init() {
            // 1. Geocode the address → coordinates
            const geocodeUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(
                address
            )}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

            const res = await fetch(geocodeUrl);
            const geo = await res.json();

            if (!geo.features?.length) return;
            const [lng, lat] = geo.features[0].center;

            // 2. Create the map
            const map = new maplibregl.Map({
                container: mapContainerRef.current!,
                style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
                center: [lng, lat],
                zoom: 13,
            });

            // 3. Add marker
            new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
        }

        init();
    }, [address]);

    return (
        <div ref={mapContainerRef} style={{ width: "100%", height: "400px", borderRadius: "8px" }}>
        </div>
    )
}

export default Map;