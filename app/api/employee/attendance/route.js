import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readData, writeData } from "@/lib/db";

export async function POST(req) {
  const cookieStore = await cookies();
  const empId = cookieStore.get("nexwork_emp")?.value;
  if (!empId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, mode = "Office", note = "" } = await req.json();
  const data = await readData();
  const emp = (data.employees || []).find(
    (e) => e.employeeId.toLowerCase() === empId.toLowerCase()
  );

  if (!emp) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const now = new Date();
  const todayDate = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const currentTime = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  data.attendance = data.attendance || [];
  const existingIdx = data.attendance.findIndex(
    (a) =>
      a.employeeId.toLowerCase() === emp.employeeId.toLowerCase() &&
      a.date === todayDate
  );

  if (action === "checkin") {
    if (existingIdx !== -1) {
      return NextResponse.json(
        { error: "Aaj ki attendance pehle hi lag chuki hai!" },
        { status: 400 }
      );
    }

    data.attendance.unshift({
      id: Date.now().toString(),
      employeeId: emp.employeeId,
      name: emp.name,
      role: emp.role,
      date: todayDate,
      checkIn: currentTime,
      checkOut: "",
      mode,
      note,
      status: "Present",
    });
  } else if (action === "checkout") {
    if (existingIdx === -1) {
      return NextResponse.json(
        { error: "Pehle Check-In (Attendance) mark karein" },
        { status: 400 }
      );
    }
    data.attendance[existingIdx].checkOut = currentTime;
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await writeData(data);
  return NextResponse.json({ success: true });
}
