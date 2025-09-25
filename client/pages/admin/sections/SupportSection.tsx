import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { loadStore, logAudit } from "../store";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/chat${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function SupportSection() {
  const [store, setStore] = React.useState(loadStore());
  const [noticeTitle, setNoticeTitle] = React.useState("");
  const [noticeMsg, setNoticeMsg] = React.useState("");
  const [ticketSubject, setTicketSubject] = React.useState("");
  const [ticketDesc, setTicketDesc] = React.useState("");
  const [faqQ, setFaqQ] = React.useState("");
  const [faqA, setFaqA] = React.useState("");
  const [faqs, setFaqs] = React.useState<{ q: string; a: string }[]>([]);
  const [logs, setLogs] = React.useState<any[]>([]);
  const refresh = () => setStore(loadStore());

  React.useEffect(() => {
    (async () => {
      try {
        const f = await api<{ items: { q: string; a: string }[] }>("/faqs");
        setFaqs(f.items);
      } catch {}
      try {
        const l = await api<{ logs: any[] }>("/logs");
        setLogs(l.logs);
      } catch {}
    })();
  }, []);

  function postNotice() {
    const id = Math.random().toString(36).slice(2, 8);
    const next = [
      ...store.notices,
      { id, title: noticeTitle, message: noticeMsg, createdAt: Date.now() },
    ];
    localStorage.setItem(
      "alumnihub_admin_store_v1",
      JSON.stringify({ ...store, notices: next }),
    );
    logAudit("admin", "post_notice", noticeTitle);
    setNoticeTitle("");
    setNoticeMsg("");
    refresh();
  }

  function createTicket() {
    const id = Math.random().toString(36).slice(2, 8);
    const next = [
      ...store.helpdesk,
      {
        id,
        user: "",
        subject: ticketSubject,
        description: ticketDesc,
        status: "open" as const,
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem(
      "alumnihub_admin_store_v1",
      JSON.stringify({ ...store, helpdesk: next }),
    );
    logAudit("admin", "create_ticket", ticketSubject);
    setTicketSubject("");
    setTicketDesc("");
    refresh();
  }

  function setTicketStatus(
    id: string,
    status: "open" | "in_progress" | "resolved",
  ) {
    const next = store.helpdesk.map((t) =>
      t.id === id ? { ...t, status } : t,
    );
    localStorage.setItem(
      "alumnihub_admin_store_v1",
      JSON.stringify({ ...store, helpdesk: next }),
    );
    logAudit("admin", "set_ticket_status", `${id}:${status}`);
    refresh();
  }

  async function addFaq() {
    if (!faqQ || !faqA) return;
    await api("/faqs", {
      method: "POST",
      body: JSON.stringify({ q: faqQ, a: faqA }),
    });
    setFaqs((f) => [{ q: faqQ, a: faqA }, ...f.filter((x) => x.q !== faqQ)]);
    setFaqQ("");
    setFaqA("");
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>System Notices</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Input
            placeholder="Title"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
          />
          <Textarea
            placeholder="Message"
            value={noticeMsg}
            onChange={(e) => setNoticeMsg(e.target.value)}
          />
          <Button onClick={postNotice}>Post Notice</Button>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.notices.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>{n.title}</TableCell>
                  <TableCell className="max-w-[360px] truncate">
                    {n.message}
                  </TableCell>
                  <TableCell>
                    {new Date(n.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Helpdesk / Tickets</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid md:grid-cols-3 gap-2">
            <Input
              placeholder="Subject"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
            />
            <Button onClick={createTicket}>Create Ticket</Button>
          </div>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.helpdesk.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>
                    {new Date(t.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setTicketStatus(t.id, "open")}
                      >
                        Open
                      </button>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setTicketStatus(t.id, "in_progress")}
                      >
                        In Progress
                      </button>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setTicketStatus(t.id, "resolved")}
                      >
                        Resolved
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chatbot FAQs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid md:grid-cols-2 gap-2">
            <Input
              placeholder="Question (keywords)"
              value={faqQ}
              onChange={(e) => setFaqQ(e.target.value)}
            />
            <Input
              placeholder="Answer"
              value={faqA}
              onChange={(e) => setFaqA(e.target.value)}
            />
          </div>
          <Button onClick={addFaq}>Add / Update FAQ</Button>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((f, i) => (
                <TableRow key={i}>
                  <TableCell className="max-w-[260px] truncate">
                    {f.q}
                  </TableCell>
                  <TableCell className="max-w-[360px] truncate">
                    {f.a}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chat Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {new Date(l.at || Date.now()).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-[260px] truncate">
                    {l.message}
                  </TableCell>
                  <TableCell className="max-w-[360px] truncate">
                    {l.answer}
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-sm text-muted-foreground"
                  >
                    No logs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
