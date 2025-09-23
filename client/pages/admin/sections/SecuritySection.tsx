import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadStore, AdminAPI } from "../store";

export default function SecuritySection() {
  const [store, setStore] = React.useState(loadStore());
  const [ip, setIp] = React.useState("");
  const [region, setRegion] = React.useState("");
  const refresh = () => setStore(loadStore());

  function toggleMFA(v: boolean) {
    AdminAPI.setSecurity({ enforceMFA: v });
    refresh();
  }

  function addIp() {
    const list = [...(store.security.loginRestrictions?.ipAllowList || []), ip].filter(Boolean);
    AdminAPI.setSecurity({ loginRestrictions: { ipAllowList: list } });
    setIp("");
    refresh();
  }
  function addRegion() {
    const list = [...(store.security.loginRestrictions?.regionsAllowList || []), region].filter(Boolean);
    AdminAPI.setSecurity({ loginRestrictions: { regionsAllowList: list } });
    setRegion("");
    refresh();
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center gap-3">
            <Switch checked={store.security.enforceMFA} onCheckedChange={toggleMFA} />
            <span>Enforce multi-factor authentication for users</span>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <div className="text-sm font-medium mb-1">Allowed IPs</div>
              <div className="flex gap-2">
                <Input placeholder="e.g. 203.0.113.0/24" value={ip} onChange={(e) => setIp(e.target.value)} />
                <Button onClick={addIp}>Add</Button>
              </div>
              <ul className="mt-2 text-sm">
                {(store.security.loginRestrictions?.ipAllowList || []).map((i, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{i}</span>
                    <Button variant="outline" size="sm" onClick={() => { const next = (store.security.loginRestrictions?.ipAllowList || []).filter((x) => x !== i); AdminAPI.setSecurity({ loginRestrictions: { ipAllowList: next } }); refresh(); }}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Allowed Regions</div>
              <div className="flex gap-2">
                <Input placeholder="e.g. India, US" value={region} onChange={(e) => setRegion(e.target.value)} />
                <Button onClick={addRegion}>Add</Button>
              </div>
              <ul className="mt-2 text-sm">
                {(store.security.loginRestrictions?.regionsAllowList || []).map((r, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{r}</span>
                    <Button variant="outline" size="sm" onClick={() => { const next = (store.security.loginRestrictions?.regionsAllowList || []).filter((x) => x !== r); AdminAPI.setSecurity({ loginRestrictions: { regionsAllowList: next } }); refresh(); }}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.audit.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{new Date(a.at).toLocaleString()}</TableCell>
                  <TableCell>{a.actor}</TableCell>
                  <TableCell>{a.action}</TableCell>
                  <TableCell className="max-w-[360px] truncate">{a.details || ""}</TableCell>
                </TableRow>
              ))}
              {store.audit.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground">No audit events.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
