"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [url, setUrl] = useState("");
  const [englishSummary, setEnglishSummary] = useState("");
  const [urduSummary, setUrduSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setEnglishSummary("");
    setUrduSummary("");
    setError("");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "API error");
      }

      const data = await res.json();
      setEnglishSummary(data.englishSummary);
      setUrduSummary(data.urduSummary);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error:", error.message);
      setError("❌ Failed to summarise blog. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Blog Summariser</h1>

      <Input
        placeholder="Enter blog URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleSubmit} disabled={loading || !url}>
        {loading ? "Summarising..." : "Summarise"}
      </Button>

      {error && (
        <p className="text-red-500 mt-4 text-sm">{error}</p>
      )}

      {englishSummary && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="font-semibold mb-2">🗒️ English Summary:</h2>
          <p>{englishSummary}</p>
        </div>
      )}

      {urduSummary && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="font-semibold mb-2">📌 Urdu Summary:</h2>
          <p>{urduSummary}</p>
        </div>
      )}
    </main>
  );
}
