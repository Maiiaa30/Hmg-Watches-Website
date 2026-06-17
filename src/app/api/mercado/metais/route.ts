import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export const revalidate = 3600; // 1 hour cache

const METAL_SYMBOLS = ["XAU", "XAG", "XPT", "XPD"] as const;

// Keyless precious-metal spot prices in EUR/oz.
// gold-api.com → USD/oz, open.er-api.com → USD→EUR.
export async function GET() {
  try {
    const [fxRes, ...metalResults] = await Promise.all([
      fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } }),
      ...METAL_SYMBOLS.map((s) =>
        fetch(`https://api.gold-api.com/price/${s}`, { next: { revalidate: 3600 } })
      ),
    ]);

    const fx = fxRes.ok ? ((await fxRes.json()) as { rates?: Record<string, number> }) : null;
    const usdToEur = fx?.rates?.EUR;
    if (!usdToEur) {
      return NextResponse.json<ApiResponse>({ success: true, data: { prices: {}, updatedAt: null } });
    }

    const prices: Record<string, number> = {};
    await Promise.all(
      metalResults.map(async (res, i) => {
        const symbol = METAL_SYMBOLS[i];
        if (!symbol || !res.ok) return;
        const data = (await res.json()) as { price?: number };
        if (typeof data.price === "number") prices[symbol] = data.price * usdToEur;
      })
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { prices, updatedAt: new Date().toISOString() },
    });
  } catch {
    return NextResponse.json<ApiResponse>({ success: true, data: { prices: {}, updatedAt: null } });
  }
}
