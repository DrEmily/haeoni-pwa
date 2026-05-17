import { NextRequest } from "next/server";
import { fetchShortTermForecast } from "@/lib/kma";

const LOCATIONS: Record<string, { nx: number; ny: number }> = {
  seoul: { nx: 60, ny: 127 },
  yangyang: { nx: 92, ny: 131 },
};

export const revalidate = 300; // 5분 캐시

export async function GET(
  _req: NextRequest,
  { params }: { params: { city: string } }
) {
  const loc = LOCATIONS[params.city];
  if (!loc) {
    return Response.json(
      { error: `Unknown city: ${params.city}` },
      { status: 400 }
    );
  }
  try {
    const data = await fetchShortTermForecast(loc.nx, loc.ny);
    return Response.json(data);
  } catch (e: any) {
    return Response.json(
      { error: e?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}
