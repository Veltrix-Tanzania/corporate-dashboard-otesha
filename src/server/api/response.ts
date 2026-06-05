import { NextResponse } from "next/server";
import type { ApiErrorBody, ApiSuccess } from "@/lib/api/types";

export function ok<T>(data: T, status = 200) {
  const body: ApiSuccess<T> = { data };
  return NextResponse.json(body, { status });
}

export function fail(code: string, message: string, status = 400) {
  const body: ApiErrorBody = { error: { code, message } };
  return NextResponse.json(body, { status });
}
