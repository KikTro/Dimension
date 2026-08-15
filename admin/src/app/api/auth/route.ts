import { NextResponse } from "next/server";
import { checkPassword, createAdminSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, password } = body;

    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out" });
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    if (!password || !checkPassword(password)) {
      return NextResponse.json(
        { error: "Invalid admin authentication passcode" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
