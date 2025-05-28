import { NextRequest, NextResponse } from "next/server";
// import {HttpError } from '@influxdata/influxdb-client'
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET(req: NextRequest) {

  try {
    const searchParams = req.nextUrl.searchParams;

    const filePath = path.join(process.cwd(), "public", "simulations", "simplified", searchParams.get("file") || "")
    const fileContent = fs.readFileSync(filePath, "utf8");

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    return NextResponse.json(records);
  } catch (error: unknown) {
    console.error('Error in API route:', error)
    return NextResponse.error()
  }
}
