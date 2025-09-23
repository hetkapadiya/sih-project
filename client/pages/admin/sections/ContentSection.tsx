import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminAPI, exportCSV, exportPDF, fileToDataUrl, loadStore } from "../store";

export default function ContentSection() {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const [eventLocation, setEventLocation] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [store, setStore] = React.useState(loadStore());
  const refresh = () => setStore(loadStore());

  function addAnnouncement() {
    if (!title.trim()) return;
    AdminAPI.addAnnouncement({ title, body, published: true });
    setTitle("");
    setBody("");
    refresh();
  }

  function addEvent() {
    if (!eventTitle || !eventDate) return;
    AdminAPI.addEvent({ title: eventTitle, description: "", date: eventDate, location: eventLocation });
    setEventTitle("");
    setEventDate("");
    setEventLocation("");
    refresh();
  }

  async function uploadFile() {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    AdminAPI.addFile({ name: file.name, type: file.type, size: file.size, dataUrl });
    setFile(null);
    (document.getElementById("file-input") as HTMLInputElement).value = "";
    refresh();
  }

  function exportAnnouncementsCSV() {
    const rows = store.announcements.map((a) => [a.title, a.published ? "Yes" : "No", new Date(a.createdAt).toLocaleString()]);
    exportCSV("announcements", ["Title", "Published", "Created"], rows);
  }
  function exportAnnouncementsPDF() {
    const rows = store.announcements.map((a) => [a.title, a.published ? "Yes" : "No", new Date(a.createdAt).toLocaleString()]);
    exportPDF("Announcements", ["Title", "Published", "Created"], rows);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Announcements / Newsletters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Write announcement..." value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={addAnnouncement}>Post</Button>
            <Button variant="secondary" onClick={exportAnnouncementsCSV}>Export CSV</Button>
            <Button onClick={exportAnnouncementsPDF}>Export PDF</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.announcements.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.published ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="secondary" onClick={() => { AdminAPI.updateAnnouncement(a.id, { published: !a.published }); refresh(); }}>{a.published ? "Unpublish" : "Publish"}</Button>
                    <Button size="sm" variant="outline" className="ml-2" onClick={() => { AdminAPI.removeAnnouncement(a.id); refresh(); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events & Registrations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid md:grid-cols-3 gap-2">
            <Input placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            <Input placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
          </div>
          <Button onClick={addEvent}>Create Event</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.title}</TableCell>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.location}</TableCell>
                  <TableCell>{e.registrations.length}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => { AdminAPI.addRegistration(e.id, { name: "Guest", email: "guest@example.com", paid: true, amount: 0 }); refresh(); }}>Add Test Registration</Button>
                    <Button size="sm" variant="outline" className="ml-2" onClick={() => { AdminAPI.removeEvent(e.id); refresh(); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents & Images</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <input id="file-input" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={uploadFile} disabled={!file}>Upload</Button>
          <div className="grid gap-4 md:grid-cols-4">
            {store.files.map((f) => (
              <div key={f.id} className="border rounded-md p-2">
                <div className="text-sm font-medium truncate">{f.name}</div>
                <div className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</div>
                {f.type.startsWith("image/") && (
                  <img src={f.dataUrl} alt={f.name} className="mt-2 rounded" />
                )}
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => AdminAPI.removeFile(f.id) || refresh()}>Delete</Button>
                  <a href={f.dataUrl} download={f.name} className="text-sm underline">Download</a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
