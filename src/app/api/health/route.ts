import { NextResponse } from "next/server";

/** Lightweight probe for GKE / GCP LB BackendConfig. */
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
