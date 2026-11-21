import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const empId = cookieStore.get("nexwork_emp")?.value;
  if (!empId) {
    return NextResponse.json({ authenticated: false });
  }

  const data = await readData();
  const emp = (data.employees || []).find(
    (e) => e.employeeId.toLowerCase() === empId.toLowerCase()
  );

  if (!emp) {
    return NextResponse.json({ authenticated: false });
  }

  const records = (data.attendance || []).filter(
    (a) => a.employeeId.toLowerCase() === emp.employeeId.toLowerCase()
  );

  const { password, ...safeEmp } = emp;
  return NextResponse.json({
    authenticated: true,
    employee: safeEmp,
    attendance: records,
  });
}

export async function POST(req) {
  const { employeeId, password } = await req.json();
  const data = await readData();

  const emp = (data.employees || []).find(
    (e) =>
      e.employeeId.trim().toLowerCase() === String(employeeId || "").trim().toLowerCase() &&
      e.password === String(password || "")
  );

  if (!emp) {
    return NextResponse.json(
      { error: "Galat Employee ID ya Password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("nexwork_emp", emp.employeeId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("nexwork_emp", "", { path: "/", maxAge: 0 });
  return res;
}
