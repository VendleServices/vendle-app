"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { teamMembers, Member } from '@/data/members';
import { motion, AnimatePresence } from 'framer-motion';
import pinImg from '/public/pin.png';
import TeamMemberPopup from '@/components/TeamMemberPopup';

const Globe = dynamic(() => import('@/components/GlobeWrapper'), {
  ssr: false,
});

const GlobeAny = Globe as any;

const TeamGlobe = () => {
  const globeRef = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    globeRef.current.controls().autoRotate = false;
    globeRef.current.pointOfView(
      { lat: 50, lng: -100, altitude: 1.5 },
      500 // 1s animation
    );
  }, [globeReady]);

  

  return (
    <div style={{ position: 'absolute', top: '100px', width: 700, height: 500, background: 'white' }}>
      <GlobeAny
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe@2.18.3/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(255,255,255,0)"
        width={700}
        height={500}
        pointsData={Array.isArray(teamMembers) ? teamMembers : []}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0}
        pointRadius={1.2}
        pointColor={() => '#1E88E5'}
        pointsMerge={false}
        onGlobeReady={() => setGlobeReady(true)}
        onPointClick={(point: object) => setSelectedMember(point as Member)}
      />
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              maxWidth: 320,
            }}
          >
            <TeamMemberPopup member={selectedMember} />
            <button
              onClick={() => setSelectedMember(null)}
              style={{
                position: 'absolute',
                top: 8,
                right: 12,
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: 20,
                cursor: 'pointer',
                zIndex: 100,
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamGlobe; 