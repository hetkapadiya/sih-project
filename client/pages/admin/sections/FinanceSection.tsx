import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminAPI, exportCSV, exportPDF, loadStore } from "../store";

export default function FinanceSection() {
  const [store, setStore] = React.useState(loadStore());
  const [donor, setDonor] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [sponsor, setSponsor] = React.useState("");
  const [spAmount, setSpAmount] = React.useState("");
  const [ticketBuyer, setTicketBuyer] = React.useState("");
  const [ticketQty, setTicketQty] = React.useState("1");
  const refresh = () => setStore(loadStore());

  function addDonation() {
    const amt = parseFloat(amount || "0");
    if (!donor || !amt) return;
    AdminAPI.addDonation({ donor, email: "", amount: amt, campaign: "General" });
    setDonor("");
    setAmount("");
    refresh();
  }
  function addSponsorship() {
    const amt = parseFloat(spAmount || "0");
    if (!sponsor || !amt) return;
    AdminAPI.addSponsorship({ sponsor, amount: amt, package: "Gold" });
    setSponsor("");
    setSpAmount("");
    refresh();
  }
  function addTicket() {
    const qty = parseInt(ticketQty || "1", 10) || 1;
    AdminAPI.addTicket({ eventId: store.events[0]?.id || "none", buyer: ticketBuyer || "Guest", quantity: qty, total: qty * 100, paid: true });
    setTicketBuyer("");
    setTicketQty("1");
    refresh();
  }

  const donationRows = store.donations.map((d) => [d.donor, d.email || "—", d.amount, d.campaign || "—", new Date(d.createdAt).toLocaleString()]);
  const sponsorshipRows = store.sponsorships.map((s) => [s.sponsor, s.amount, s.package, new Date(s.createdAt).toLocaleString()]);
  const ticketRows = store.tickets.map((t) => [t.buyer, t.quantity, t.total, t.paid ? "Yes" : "No", new Date(t.createdAt).toLocaleString()]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader><CardTitle>Donations</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid md:grid-cols-3 gap-2">
            <Input placeholder="Donor" value={donor} onChange={(e) => setDonor(e.target.value)} />
            <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button onClick={addDonation}>Add</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => exportCSV("donations", ["Donor", "Email", "Amount", "Campaign", "Created"], donationRows)}>Export CSV</Button>
            <Button onClick={() => exportPDF("Donations", ["Donor", "Email", "Amount", "Campaign", "Created"], donationRows)}>Export PDF</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.donations.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.donor}</TableCell>
                  <TableCell>{d.email || "—"}</TableCell>
                  <TableCell>₹{d.amount.toLocaleString()}</TableCell>
                  <TableCell>{d.campaign || "—"}</TableCell>
                  <TableCell>{new Date(d.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sponsorships & Ads</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid md:grid-cols-3 gap-2">
            <Input placeholder="Sponsor" value={sponsor} onChange={(e) => setSponsor(e.target.value)} />
            <Input placeholder="Amount" type="number" value={spAmount} onChange={(e) => setSpAmount(e.target.value)} />
            <Button onClick={addSponsorship}>Add</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sponsor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.sponsorships.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.sponsor}</TableCell>
                  <TableCell>₹{s.amount.toLocaleString()}</TableCell>
                  <TableCell>{s.package}</TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Event Ticketing</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid md:grid-cols-4 gap-2">
            <Input placeholder="Buyer" value={ticketBuyer} onChange={(e) => setTicketBuyer(e.target.value)} />
            <Input placeholder="Qty" type="number" value={ticketQty} onChange={(e) => setTicketQty(e.target.value)} />
            <Button onClick={addTicket}>Add</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => exportCSV("tickets", ["Buyer", "Qty", "Total", "Paid", "Date"], ticketRows)}>Export CSV</Button>
            <Button onClick={() => exportPDF("Tickets", ["Buyer", "Qty", "Total", "Paid", "Date"], ticketRows)}>Export PDF</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.tickets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.buyer}</TableCell>
                  <TableCell>{t.quantity}</TableCell>
                  <TableCell>₹{t.total.toLocaleString()}</TableCell>
                  <TableCell>{t.paid ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
