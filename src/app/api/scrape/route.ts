import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import dictionary from "../../../lib/dictionary";

function simulateSummary(text: string): string {
  return text.split(".").slice(0, 3).join(".") + ".";
}

function translateToUrdu(summary: string): string {
  return summary
    .split(" ")
    .map((word) => dictionary[word.toLowerCase()] || word)
    .join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    console.log("🟡 Received URL:", url);

    const response = await axios.get(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36",
    Accept: "text/html",
  },
});

    console.log("✅ Blog fetched");

    const $ = cheerio.load(response.data);
    // Try targeting actual article content first
let text = $("article").text();

if (!text || text.length < 100) {
  // fallback: body text but without script/style
  $("script, style, noscript").remove();
  text = $("body").text();
}

text = text.replace(/\s+/g, " ").trim();

    console.log("🟢 Extracted text length:", text.length);

    const summary = simulateSummary(text);
    console.log("✂️ Summary:", summary);

    const urduSummary = translateToUrdu(summary);
    console.log("🌐 Urdu Summary:", urduSummary);

    return NextResponse.json({ urduSummary });
  } catch (error: any) {
    console.error("🔥 API Error:", error.message);
    return NextResponse.json(
      { error: "Server failed to summarise blog." },
      { status: 500 }
    );
  }
}
