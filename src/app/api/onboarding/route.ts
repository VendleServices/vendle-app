import { NextResponse } from "next/server";
import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";

export async function POST(req: Request, res: Response) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const claimData = await req.json();

        await prisma.claim.create({
            data: {
                ...claimData,
                userId: user.id,
            }
        });

        return NextResponse.json({ data: claimData }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}