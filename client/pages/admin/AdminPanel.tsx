import React from "react";
import AdminLayout, { AdminSection } from "./AdminLayout";
import DashboardHome from "./sections/DashboardHome";
import UsersSection from "./sections/UsersSection";
import ContentSection from "./sections/ContentSection";
import CommunicationSection from "./sections/CommunicationSection";
import FinanceSection from "./sections/FinanceSection";
import SecuritySection from "./sections/SecuritySection";
import ReportsSection from "./sections/ReportsSection";
import SettingsSection from "./sections/SettingsSection";
import SupportSection from "./sections/SupportSection";

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
