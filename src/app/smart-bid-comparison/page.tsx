import SmartBidComparison from "@/components/SmartBidComparison";
import { PageTransition } from "@/lib/transitions";

const SmartBidComparisonPage = () => {
  return (
    <PageTransition>
      <div className="pt-24">
        <SmartBidComparison />
      </div>
    </PageTransition>
  );
};

export default SmartBidComparisonPage; 