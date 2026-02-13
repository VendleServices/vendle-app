"use client"

import AgentTab from "@/components/AgentTab";
import { PageTransition } from "@/lib/transitions";

const AgentPage = () => {
  return (
    <PageTransition>
      <div className="pt-24">
        <AgentTab />
      </div>
    </PageTransition>
  );
};

export default AgentPage; 