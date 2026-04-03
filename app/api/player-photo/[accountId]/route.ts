import { getPlayerPhoto } from "@/lib/endpoints";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  const { accountId } = await params;
  const photo = await getPlayerPhoto(accountId);
  return NextResponse.json(photo);
}
