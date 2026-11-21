import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await readData();

    const entry = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      ...body.payload,
    };

    if (body.type === "enquiry") {
      data.enquiries.unshift(entry);
    } else if (body.type === "application") {
      data.applications.unshift(entry);
    } else if (body.type === "review") {
      data.reviews = data.reviews || [];
      data.reviews.unshift(entry);
    } else {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
    }

    await writeData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
