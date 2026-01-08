import rateLimit from "express-rate-limit";

export const generalApiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5
});

export const chatbotLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    keyGenerator: (req: any) => {
        return `${req?.user?.id}${req?.params?.claimId}`
    },
    handler: (req: any, res: any) => {
        res.status(429).json({
            status: "You can only send 5 questions per hour"
        })
    }
});

export const userLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    keyGenerator: (req: any) => {
        return req?.user?.id || req?.ip;
    },
});