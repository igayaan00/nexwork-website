import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readData } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("nexwork_admin")?.value === "true";
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(req) {
  const { username, password } = await req.json();
  const data = await readData();

  const validUser = process.env.ADMIN_USER || data.adminAuth?.username || "admin";
  const validPass = process.env.ADMIN_PASS || data.adminAuth?.password || "nexwork@123";

  if (username === validUser && password === validPass) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("nexwork_admin", "true", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("nexwork_admin", "", { path: "/", maxAge: 0 });
  return res;
}
