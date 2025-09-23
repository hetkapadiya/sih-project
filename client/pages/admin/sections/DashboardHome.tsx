import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadStore } from "../store";
import { useAuth } from "@/context/AuthProvider";
import { Users, CalendarDays, HandCoins, ShieldCheck } from "lucide-react";

export default function DashboardHome() {
  const { getUsers } = useAuth();
  const users = getUsers();
  const store = loadStore();
  const totalEvents = store.events.length;
  const totalDonations = store.donations.reduce((s, d) => s + d.amount, 0);
  const openTickets = store.helpdesk.filter((t) => t.status !== "resolved").length;

  const stats = [
    { label: "Users", value: users.length, icon: Users },
    { label: "Events", value: totalEvents, icon: CalendarDays },
    { label: "Donations", value: `₹${totalDonations.toLocaleString()}`, icon: HandCoins },
    { label: "Open Tickets", value: openTickets, icon: ShieldCheck },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {store.announcements.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <span className="font-medium">{a.title}</span>
                <span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
              </li>
            ))}
            {store.announcements.length === 0 && (
              <div className="text-sm text-muted-foreground">No announcements yet.</div>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">All systems operational.</div>
        </CardContent>
      </Card>
    </div>
  );
}
