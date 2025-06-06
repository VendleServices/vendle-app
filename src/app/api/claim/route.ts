import { NextResponse } from "next/server";
import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";

export async function GET(req: Request, res: Response) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "No user found" }, { status: 401 })
        }

        const claims = await prisma.claim.findMany({
            where: {
                userId: user.id,
            }
        });

        return NextResponse.json({ claims }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 });
    }
}