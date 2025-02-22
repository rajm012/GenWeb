"use client"

import { useState } from "react";

export default function TestAgentPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAgent = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch response");

      setResponse(JSON.stringify(data.response, null, 2)); // ✅ Store formatted JSON response
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Test Your AI Agent</h1>

      <input
        type="text"
        className="w-80 p-2 border border-gray-500 rounded bg-gray-800 text-white"
        placeholder="Describe your web app..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 disabled:opacity-50"
        onClick={callAgent}
        disabled={loading || !userInput}
      >
        {loading ? "Generating..." : "Send to AI Agent"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      
      {response && (
        <div className="mt-6 w-full max-w-2xl bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold">AI Response:</h2>
          <pre className="text-sm whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
}
