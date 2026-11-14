import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const confidence = searchParams.get("confidence");
    const search = searchParams.get("search");

    const whereClause: any = {};
    if (category && category !== "Todas") whereClause.category = category;
    if (confidence && confidence !== "Todas") whereClause.confidence = confidence;
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
      ];
    }

    const news = await prisma.newsEvent.findMany({
      where: whereClause,
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ data: news, total: news.length });
  } catch (error) {
    console.error("Erro na API de notícias:", error);
    return NextResponse.json({ error: "Erro ao buscar notícias" }, { status: 500 });
  }
}
