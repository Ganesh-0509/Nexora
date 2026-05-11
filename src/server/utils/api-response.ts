import { NextResponse } from "next/server";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

export class ApiUtils {
  static success<T>(data: T, status = 200, meta?: ApiResponse<T>["meta"]) {
    return NextResponse.json(
      {
        success: true,
        data,
        meta,
      },
      { status }
    );
  }

  static error(message: string, status = 400, code?: string, details?: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
          code,
          details,
        },
      },
      { status }
    );
  }
}
