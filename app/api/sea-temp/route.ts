import { fetchSeaTemperature } from "@/lib/nifs";

export const revalidate = 1800; // 30분 캐시

export async function GET() {
  try {
    const data = await fetchSeaTemperature("byy87");
    return Response.json(data);
  } catch (e: any) {
    return Response.json(
      { error: e?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}
