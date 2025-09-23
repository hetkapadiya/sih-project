import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminAPI, applyBranding, getBackupJSON, loadStore, restoreFromJSON, logAudit } from "../store";

export default function SettingsSection() {
  const [store, setStore] = React.useState(loadStore());
  const [color, setColor] = React.useState(store.branding.primaryColor || "");
  const [banner, setBanner] = React.useState(store.branding.bannerText || "");
  const [logo, setLogo] = React.useState<string | undefined>(store.branding.logoDataUrl);
  const [fieldLabel, setFieldLabel] = React.useState("");
  const [integrationEmail, setIntegrationEmail] = React.useState(store.integrations.emailServiceKey || "");
  const [integrationPayment, setIntegrationPayment] = React.useState(store.integrations.paymentGatewayKey || "");

  const refresh = () => setStore(loadStore());

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.readAsDataURL(f);
  }

  function saveBranding() {
    AdminAPI.setBranding({ primaryColor: color, bannerText: banner, logoDataUrl: logo });
    applyBranding({ primaryColor: color, bannerText: banner, logoDataUrl: logo });
    logAudit("admin", "save_branding", color || "");
    refresh();
  }

  function addProfileField() {
    const id = Math.random().toString(36).slice(2, 8);
    const next = [...store.customFields, { id, entity: "profile", label: fieldLabel, type: "text" as const }];
    AdminAPI.setBranding({}); // noop to trigger save side-effect
    localStorage.setItem("alumnihub_admin_store_v1", JSON.stringify({ ...store, customFields: next }));
    setFieldLabel("");
    refresh();
  }

  function saveIntegrations() {
    AdminAPI.setIntegrations({ emailServiceKey: integrationEmail, paymentGatewayKey: integrationPayment });
    logAudit("admin", "save_integrations");
    refresh();
  }

  function downloadBackup() {
    const data = getBackupJSON();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alumnihub-admin-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    logAudit("admin", "download_backup");
  }

  function restoreBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { restoreFromJSON(String(reader.result)); logAudit("admin", "restore_backup"); refresh(); } catch {}
    };
    reader.readAsText(f);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid md:grid-cols-3 gap-2">
            <Input placeholder="Primary color (HSL or CSS color)" value={color} onChange={(e) => setColor(e.target.value)} />
            <Input placeholder="Banner text" value={banner} onChange={(e) => setBanner(e.target.value)} />
            <input type="file" accept="image/*" onChange={onLogoChange} />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveBranding}>Save</Button>
            {logo && <img src={logo} alt="logo" className="h-8" />}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Profile Fields</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Field label" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} />
            <Button onClick={addProfileField}>Add</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.customFields.map((f) => (
                <TableRow key={f.id}><TableCell>{f.label}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <Input placeholder="Email service API key" value={integrationEmail} onChange={(e) => setIntegrationEmail(e.target.value)} />
          <Input placeholder="Payment gateway API key" value={integrationPayment} onChange={(e) => setIntegrationPayment(e.target.value)} />
          <Button onClick={saveIntegrations}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Backup / Restore</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button onClick={downloadBackup}>Download Backup</Button>
          <input type="file" accept="application/json" onChange={restoreBackup} />
        </CardContent>
      </Card>
    </div>
  );
}
