"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Laptop, Globe, LogOut } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Account Settings",
      icon: <User className="h-5 w-5" />,
      items: ["Personal Information", "Email Preferences", "Security & Password"]
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      items: ["Push Notifications", "Email Alerts", "Weekly Digest"]
    },
    {
      title: "Platform",
      icon: <Laptop className="h-5 w-5" />,
      items: ["Theme Preference", "Language", "Accessibility"]
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-outfit mb-2">Settings</h1>
        <p className="text-muted-foreground mb-12">Manage your account settings and preferences.</p>

        <div className="space-y-8">
          {settingsSections.map((section, i) => (
            <div key={i} className="p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer group">
                    <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Configure</Button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="p-8 rounded-3xl border border-destructive/20 bg-destructive/5">
             <h3 className="text-xl font-bold text-destructive mb-2">Danger Zone</h3>
             <p className="text-sm text-destructive/80 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
             <Button variant="destructive" className="rounded-xl">Delete Account</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
