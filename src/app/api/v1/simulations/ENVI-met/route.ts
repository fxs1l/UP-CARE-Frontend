import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const formatDate = (d: Date) => {
  const philTime = new Date(d.getTime() + 8 * 60 * 60 * 1000);   // Convert to Philippine Time (UTC+8)
  return philTime.toISOString().split("T")[0];
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pollutant = searchParams.get("pollutant");
  const from = searchParams.get("startTime") || searchParams.get("from");
  const to = searchParams.get("endTime") || searchParams.get("to");

  if (!pollutant || !from || !to) {
    return NextResponse.json(
      { error: "Missing 'pollutant', 'from', or 'to' query param" },
      { status: 400 }
    );
  }

  const startDate = new Date(from);
  const endDate = new Date(to);
  const availableImages: { date: string; hour: number; url: string }[] = [];

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = formatDate(d);
    const dayPath = path.join(
      process.cwd(),
      "public",
      "simulations",
      "ENVI-met",
      pollutant,
      dateStr
    );

    for (let hour = 1; hour <= 24; hour++) {
      const hourStr = String(hour).padStart(2, "0");
      const filename = `HR-${hourStr}.png`;
      const filePath = path.join(dayPath, filename);
      const publicUrl = `/simulations/ENVI-met/${pollutant}/${dateStr}/${filename}`;

      try {
        fs.accessSync(filePath, fs.constants.F_OK);
        availableImages.push({ date: dateStr, hour, url: publicUrl });
      } catch {
      }
    }

  }

  return NextResponse.json(availableImages);
}
