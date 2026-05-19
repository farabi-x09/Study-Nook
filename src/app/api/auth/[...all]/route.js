import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const { GET: originalGET, POST: originalPOST } = toNextJsHandler(auth);

const wrapHandler = (originalHandler) => {
  return async (req, context) => {
    const url = req.url || "";
    const isGetSession = url.includes("/get-session");

    try {
      const response = await originalHandler(req, context);
      
      // If the session endpoint returns a 500 error, heal the client cookies
      if (isGetSession && response.status === 500) {
        const cleanResponse = NextResponse.json(
          { error: "Stale session cookie cleared." },
          { status: 401 }
        );
        cleanResponse.cookies.delete("better-auth.session-token");
        cleanResponse.cookies.delete("better-auth.session_data");
        return cleanResponse;
      }
      return response;
    } catch (error) {
      console.error("Better Auth Interceptor caught an error:", error);
      
      // If get-session fails directly, heal the client cookies
      if (isGetSession) {
        const cleanResponse = NextResponse.json(
          { error: "Invalid session. Session cleared." },
          { status: 401 }
        );
        cleanResponse.cookies.delete("better-auth.session-token");
        cleanResponse.cookies.delete("better-auth.session_data");
        return cleanResponse;
      }
      
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  };
};

export const GET = wrapHandler(originalGET);
export const POST = wrapHandler(originalPOST);