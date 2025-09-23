import React from "react";
import AdminLayout, { AdminSection } from "./admin/AdminLayout";
import DashboardHome from "./admin/sections/DashboardHome";
import UsersSection from "./admin/sections/UsersSection";
import ContentSection from "./admin/sections/ContentSection";
import CommunicationSection from "./admin/sections/CommunicationSection";
import FinanceSection from "./admin/sections/FinanceSection";
import SecuritySection from "./admin/sections/SecuritySection";
import ReportsSection from "./admin/sections/ReportsSection";
import SettingsSection from "./admin/sections/SettingsSection";
import SupportSection from "./admin/sections/SupportSection";

export default function AdminPanel() {
  const [section, setSection] = React.useState<AdminSection>(() => (localStorage.getItem("admin_section") as AdminSection) || "dashboard");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem("admin_section", section);
  }, [section]);

  return (
    <AdminLayout section={section} onSectionChange={setSection} search={search} setSearch={setSearch}>
      {section === "dashboard" && <DashboardHome />}
      {section === "users" && <UsersSection />}
      {section === "content" && <ContentSection />}
      {section === "communication" && <CommunicationSection />}
      {section === "finance" && <FinanceSection />}
      {section === "security" && <SecuritySection />}
      {section === "reports" && <ReportsSection />}
      {section === "settings" && <SettingsSection />}
      {section === "support" && <SupportSection />}
    </AdminLayout>
  );
}
