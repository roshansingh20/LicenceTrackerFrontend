import { useState, useRef, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello 👋 I am your License AI Copilot. Ask me about compliance, licenses, or training."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  /* ================= SEND TO AI ================= */

  async function send() {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { type: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/ai/ask", {
        question: userText
      });

      const ai = res.data;

      const isChecklist =
        userText.toLowerCase().includes("checklist") ||
        userText.toLowerCase().includes("training");

      const botMessage = {
        type: "bot",
        isChecklist,
        summary: ai.summary,
        insights: ai.insights || [],
        recommendation: ai.recommendation || ""
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "❌ AI service unavailable" }
      ]);
    }

    setLoading(false);
  }

  /* ================= EXPORT PDF ================= */

  async function exportChecklistPdf(aiMsg) {
    try {
      const res = await axiosInstance.post(
        "/ai/export-checklist",
        aiMsg,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Training_Checklist.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export PDF");
    }
  }

  /* ================= UI ================= */

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition"
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[520px] bg-white rounded-xl shadow-2xl border flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <span className="font-semibold">🤖 License AI Copilot</span>
            <button onClick={() => setOpen(false)} className="text-xl">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-slate-50">

            {messages.map((m, i) => (
              <div key={i}>
                {/* CHECKLIST AI */}
                {m.type === "bot" && m.isChecklist ? (
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-bold mb-2">{m.summary}</h3>

                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {m.insights.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>

                    <p className="text-sm mt-3 text-indigo-600">
                      {m.recommendation}
                    </p>

                    <button
                      onClick={() => exportChecklistPdf(m)}
                      className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                    >
                      📄 Export PDF
                    </button>
                  </div>
                ) : m.type === "bot" ? (
                  <div className="bg-white shadow p-3 rounded max-w-[85%]">
                    {m.text}
                  </div>
                ) : (
                  <div className="bg-indigo-600 text-white p-3 rounded ml-auto max-w-[85%]">
                    {m.text}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 italic">AI is thinking…</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about compliance, licenses, training..."
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={send}
              className="bg-indigo-600 text-white px-4 rounded"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}
