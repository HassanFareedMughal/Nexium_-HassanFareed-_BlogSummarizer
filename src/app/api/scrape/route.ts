import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { MongoClient } from "mongodb";
import { createClient } from "@supabase/supabase-js";

console.log("✅ MONGODB_URI:", process.env.MONGODB_URI);
console.log("✅ SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("✅ SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

// MongoDB Setup
const MONGODB_URI = process.env.MONGODB_URI!;
const client = new MongoClient(MONGODB_URI);
const db = client.db("blogdata");
const collection = db.collection("blogs");

// Supabase Setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simulated Summary (first 3 sentences)
function simulateSummary(text: string): string {
  return text.split(".").slice(0, 3).join(".") + ".";
}

// 🔁 LibreTranslate Urdu translation
async function translateToUrdu(text: string): Promise<string> {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "ur",
        format: "text",
      }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response from translation API");
    }

    const data = await response.json();
    return data.translatedText || "Translation failed.";
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ LibreTranslate error:", err.message);
    return "Translation failed.";
  }
}

// 🟨 POST Handler
export async function POST(req: NextRequest) {
  const { url } = await req.json();

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const text = $("article, .post-content, .blog-post, .main-content")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    console.log("🔎 Scraped Content Sample:", text.slice(0, 500));

    if (!text || text.length < 100) {
      return NextResponse.json(
        { error: "Failed to extract blog content." },
        { status: 500 }
      );
    }

    // English Summary
    const englishSummary = simulateSummary(text);

    // Urdu Translation
    const urduSummary = await translateToUrdu(englishSummary);

    // Save to MongoDB
    await collection.insertOne({ url, fullText: text });

    // Save to Supabase
    await supabase.from("summaries").insert([{ url, urduSummary }]);

    // Respond
    return NextResponse.json({ englishSummary, urduSummary });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("🔥 API Error:", err.message);
    return NextResponse.json(
      { error: "Server failed to summarise blog." },
      { status: 500 }
    );
  }
}
