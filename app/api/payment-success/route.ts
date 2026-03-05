import { NextRequest, NextResponse } from "next/server";
import { handleSuccessfulPayment } from "@/lib/actions/payment";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  try {
    const result = await handleSuccessfulPayment(sessionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment success handler error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
