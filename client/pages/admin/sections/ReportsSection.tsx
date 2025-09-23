import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportCSV, exportPDF, loadStore } from "../store";

export default function ReportsSection() {
  const store = loadStore();
  const donationByCampaign = Object.entries(
    store.donations.reduce<Record<string, number>>((acc, d) => {
      acc[d.campaign || "General"] = (acc[d.campaign || "General"] || 0) + d.amount;
      return acc;
    }, {})
  );

  function exportDonationReportCSV() {
    exportCSV("donation-report", ["Campaign", "Amount"], donationByCampaign.map(([k, v]) => [k, v]));
  }
  function exportDonationReportPDF() {
    exportPDF("Donation Report", ["Campaign", "Amount"], donationByCampaign.map(([k, v]) => [k, v]));
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Donation / Fundraising Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-3">
            <Button variant="secondary" onClick={exportDonationReportCSV}>Export CSV</Button>
            <Button onClick={exportDonationReportPDF}>Export PDF</Button>
          </div>
          <ul className="text-sm">
            {donationByCampaign.map(([name, amt]) => (
              <li key={name} className="flex items-center justify-between border-b py-1">
                <span>{name}</span>
                <span>₹{Number(amt).toLocaleString()}</span>
              </li>
            ))}
            {donationByCampaign.length === 0 && (
              <div className="text-sm text-muted-foreground">No data.</div>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Campaign Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Open rate: 0% · Click rate: 0% (simulation)</div>
        </CardContent>
      </Card>
    </div>
  );
}
