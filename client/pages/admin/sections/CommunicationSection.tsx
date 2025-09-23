import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminAPI, loadStore, exportCSV } from "../store";

export default function CommunicationSection() {
  const [store, setStore] = React.useState(loadStore());
  const [channel, setChannel] = React.useState<"email" | "sms" | "push">("email");
  const [subject, setSubject] = React.useState("");
  const [content, setContent] = React.useState("");
  const [templateName, setTemplateName] = React.useState("");
  const [templateChannel, setTemplateChannel] = React.useState<"email" | "sms" | "push">("email");
  const refresh = () => setStore(loadStore());

  function sendBulk() {
    alert(`Simulated sending ${channel} to all users. Subject: ${subject}`);
  }
  function saveTemplate() {
    AdminAPI.addTemplate({ name: templateName || `Template ${Date.now()}` , channel: templateChannel, subject, content });
    setTemplateName("");
    refresh();
  }

  function exportTemplates() {
    const rows = store.templates.map((t) => [t.name, t.channel, t.subject || "—", new Date(t.createdAt).toLocaleString()]);
    exportCSV("message-templates", ["Name", "Channel", "Subject", "Created"], rows);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Messages</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid md:grid-cols-3 gap-2">
            <select value={channel} onChange={(e) => setChannel(e.target.value as any)} className="border rounded-md px-2 py-2">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
            </select>
            <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <Textarea placeholder="Message content with {variables}" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={sendBulk}>Send</Button>
            <Button variant="secondary" onClick={saveTemplate}>Save as Template</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={exportTemplates}>Export CSV</Button>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.channel}</TableCell>
                  <TableCell>{t.subject || "—"}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.moderation.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{m.author}</TableCell>
                  <TableCell className="max-w-[320px] truncate">{m.content}</TableCell>
                  <TableCell>{m.status}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => { AdminAPI.setModeration(m.id, "approved"); refresh(); }}>Approve</Button>
                    <Button size="sm" variant="outline" className="ml-2" onClick={() => { AdminAPI.setModeration(m.id, "rejected"); refresh(); }}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
              {store.moderation.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm text-muted-foreground">No items.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentorship Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Mentee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.mentorship.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.mentor}</TableCell>
                  <TableCell>{m.mentee}</TableCell>
                  <TableCell>{m.status}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => { AdminAPI.setMentorship(m.id, "approved"); refresh(); }}>Approve</Button>
                    <Button size="sm" variant="outline" className="ml-2" onClick={() => { AdminAPI.setMentorship(m.id, "rejected"); refresh(); }}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
              {store.mentorship.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground">No requests.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Surveys / Polls</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => { AdminAPI.addSurvey({ title: `Survey ${Date.now()}`, active: true, questions: [], }); refresh(); }}>Create Survey</Button>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.surveys.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.title}</TableCell>
                  <TableCell>{s.active ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => { AdminAPI.removeSurvey(s.id); refresh(); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
