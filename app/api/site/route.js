import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readData, writeData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readData();
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("nexwork_admin")?.value === "true";

  if (!isAdmin) {
    const { enquiries, applications, adminAuth, employees, attendance, ...publicData } = data;
    return NextResponse.json(publicData);
  }
  return NextResponse.json(data);
}

export async function PUT(req) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("nexwork_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incoming = await req.json();
  const current = await readData();

  const updated = {
    ...current,
    adminAuth: incoming.adminAuth ?? current.adminAuth,
    company: incoming.company ?? current.company,
    mediaAgency: incoming.mediaAgency ?? current.mediaAgency,
    aiAutomation: incoming.aiAutomation ?? current.aiAutomation,
    digitalMarketing: incoming.digitalMarketing ?? current.digitalMarketing,
    reviews: incoming.reviews ?? current.reviews,
    enquiries: incoming.enquiries ?? current.enquiries,
    applications: incoming.applications ?? current.applications,
    employees: incoming.employees ?? current.employees,
    attendance: incoming.attendance ?? current.attendance,
  };

  await writeData(updated);
  return NextResponse.json({ success: true, data: updated });
}
