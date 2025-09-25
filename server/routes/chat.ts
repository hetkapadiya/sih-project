import type { RequestHandler } from "express";
import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const DEFAULT_FAQS = [
  {
    q: "how to login",
    a: "Go to Admin or Alumni login and use your registered email and password. If you forgot, use the reset link on the login page.",
  },
  {
    q: "update profile",
    a: "Open the Register page to update your details, or visit your dashboard and edit profile.",
  },
  {
    q: "upcoming events",
    a: "See the Upcoming Events section on the homepage or Events in the navigation.",
  },
  {
    q: "donation",
    a: "Visit the Donate page to contribute to scholarships and funds.",
  },
  {
    q: "mentorship",
    a: "See the Mentorship page to become a mentor or find one.",
  },
];

async function getDb() {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) return null; // optional
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB || "alumnihub");
  return db;
}

async function collection(name: string): Promise<Collection | null> {
  const d = await getDb();
  return d ? d.collection(name) : null;
}

export const postMessage: RequestHandler = async (req, res) => {
  const { message } = req.body as { message: string };
  const lower = (message || "").toLowerCase();

  let answer = "";
  const match = DEFAULT_FAQS.find((f) => lower.includes(f.q));
  if (match) answer = match.a;

  // Optional OpenAI support (via fetch) when OPENAI_API_KEY is set
  if (!answer && process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an alumni portal helper." },
            { role: "user", content: message },
          ],
        }),
      });
      const j = await r.json();
      answer = j.choices?.[0]?.message?.content || "";
    } catch {}
  }
  if (!answer)
    answer =
      "I couldn't find an exact answer. You can leave your query and contact, and our team will follow up.";

  const log = { message, answer, at: Date.now() };
  const logs = await collection("chat_logs");
  if (logs) await logs.insertOne(log as any);

  res.json({ answer, needs_followup: !match });
};

export const postLeave: RequestHandler = async (req, res) => {
  const { name, email, message } = req.body as {
    name: string;
    email: string;
    message: string;
  };
  const queries = await collection("chat_queries");
  if (queries)
    await queries.insertOne({ name, email, message, at: Date.now() } as any);
  res.json({ ok: true });
};

export const getLogs: RequestHandler = async (_req, res) => {
  const logs = await collection("chat_logs");
  if (!logs) return res.json({ logs: [], mode: "memory" });
  const list = await logs.find({}).sort({ at: -1 }).limit(500).toArray();
  res.json({ logs: list, mode: "mongo" });
};

export const getFaqs: RequestHandler = async (_req, res) => {
  const faqs = await collection("chat_faqs");
  if (!faqs) return res.json({ items: DEFAULT_FAQS });
  const list = await faqs.find({}).toArray();
  res.json({ items: list });
};

export const upsertFaq: RequestHandler = async (req, res) => {
  const { q, a } = req.body as { q: string; a: string };
  const faqs = await collection("chat_faqs");
  if (faqs) await faqs.updateOne({ q }, { $set: { q, a } }, { upsert: true });
  res.json({ ok: true });
};
