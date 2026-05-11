import { NextResponse } from "next/server";
import { ApiUtils } from "./api-response";
import { ZodError } from "zod";

export function withErrorHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      console.error("[API_ERROR]", error);

      if (error instanceof ZodError) {
        return ApiUtils.error("Validation failed", 422, "VALIDATION_ERROR", error.errors);
      }

      // Handle Prisma errors
      if (error.code === "P2002") {
        return ApiUtils.error("Record already exists", 409, "CONFLICT_ERROR");
      }

      if (error.code === "P2025") {
        return ApiUtils.error("Record not found", 404, "NOT_FOUND_ERROR");
      }

      return ApiUtils.error(
        process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
        500,
        "INTERNAL_SERVER_ERROR"
      );
    }
  };
}
