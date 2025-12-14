import { Router } from 'express';
import { RecommendationEngine } from "../../utils/recommendation-engine";

const recommendationEngine = new RecommendationEngine();

const router = Router();

router.post("/", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const analysisRequest = req.body;
        const data = await recommendationEngine.analyzeContractors(analysisRequest);

        return res.status(200).json({ data });
    } catch (error) {
        console.log(error)
    }
});

export default router;