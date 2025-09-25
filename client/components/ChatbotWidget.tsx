import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ChatItem { role: "user" | "assistant"; content: string; time: number }

const BLUE = "rgb(18, 24, 38)"; // matches header navy

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/chat${path}`, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const quickLinks = [
  { label: "Update Profile", href: "/register" },
  { label: "Upcoming Events", href: "#events" },
  { label: "Mentorship Program", href: "/mentorship" },
  { label: "Donation Page", href: "/donate" },
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>(() => [{ role: "assistant", content: "Hello 👋 I’m your Alumni Assistant! How can I help you today?", time: Date.now() }]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length, open]);

  async function send() {
    if (!input.trim()) return;
    const userMsg: ChatItem = { role: "user", content: input, time: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const data = await api<{ answer: string; needs_followup?: boolean }>("/message", { method: "POST", body: JSON.stringify({ message: userMsg.content }) });
      const reply: ChatItem = { role: "assistant", content: data.answer, time: Date.now() };
      setMessages((m) => [...m, reply]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I ran into a problem. Please try again later.", time: Date.now() }]);
    } finally { setLoading(false); }
  }

  function leaveQuery(name: string, email: string, message: string) {
    return api("/leave", { method: "POST", body: JSON.stringify({ name, email, message }) });
  }

  const bubble = (
    <button
      aria-label="Open chatbot"
      onClick={() => setOpen((o) => !o)}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg flex items-center justify-center text-white"
      style={{ background: BLUE, animation: "pulse 2s infinite" }}
    >
      {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      <style>{`@keyframes pulse {0%{box-shadow:0 0 0 0 rgba(24,58,108,.6)}70%{box-shadow:0 0 0 18px rgba(24,58,108,0)}100%{box-shadow:0 0 0 0 rgba(24,58,108,0)}}`}</style>
    </button>
  );

  return (
    <>
      {bubble}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(92vw,380px)] rounded-xl border bg-white shadow-xl flex flex-col overflow-hidden">
          <div className="px-3 py-2" style={{ background: BLUE }}>
            <div className="text-white font-semibold">Alumni Assistant</div>
            <div className="text-white/70 text-xs">Ask about login, profile, events, donations, mentorship</div>
          </div>
          <div className="p-3 grid gap-2">
            <div className="flex gap-2 flex-wrap">
              {quickLinks.map((q) => (
                <a key={q.label} href={q.href} className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: BLUE, color: BLUE }}>{q.label}</a>
              ))}
            </div>
            <div className="h-64 overflow-auto border rounded-md p-2 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div className={"inline-block px-3 py-2 my-1 rounded-lg text-sm " + (m.role === "user" ? "bg-blue-600 text-white" : "bg-white border")}>{m.content}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type your message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
              <Button onClick={send} disabled={loading} size="icon"><Send className="h-4 w-4" /></Button>
            </div>
            <details className="text-xs text-slate-500">
              <summary>Leave a query for admin follow-up</summary>
              <LeaveQueryForm onSubmit={leaveQuery} />
            </details>
          </div>
        </div>
      )}
    </>
  );
}

function LeaveQueryForm({ onSubmit }: { onSubmit: (name: string, email: string, message: string) => Promise<any> | any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <form className="grid gap-2 mt-2" onSubmit={async (e) => { e.preventDefault(); await onSubmit(name, email, message); setSent(true); setName(""); setEmail(""); setMessage(""); }}>
      <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Textarea placeholder="Your question" value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button type="submit" disabled={sent}>{sent ? "Sent" : "Send"}</Button>
    </form>
  );
}
