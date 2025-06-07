import { NextResponse } from "next/server";
import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";

interface RouteParams {
    params: Promise<{
        claimId: string;
    }>;
}

export async function GET(req: Request, context: RouteParams) {
    try {
        const { claimId } = await context.params;
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "No user found" }, { status: 401 })
        }

        const claim = await prisma.claim.findUnique({
            where: {
                userId: user.id,
                id: claimId
            }
        });

        return NextResponse.json({ claim }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: RouteParams) {
    try {
        const { claimId } = await context.params;
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "No user found" }, { status: 401 });
        }

        await prisma.claim.delete({ where: { id: claimId } });

        return NextResponse.json({ message: "claim deleted successfully" }, { status: 204 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 });
    }
}