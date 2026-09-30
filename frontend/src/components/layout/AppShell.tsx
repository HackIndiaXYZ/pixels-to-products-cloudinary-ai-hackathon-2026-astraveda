"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Sparkles, Compass, Film, Palette, Folders, ArrowUpRight, ShieldCheck, Activity } from "lucide-react";
import { JudgeViewModal } from "../common/JudgeViewModal";

const NAV_ITEMS = [
  { href: "/create", label: "Create", icon: Sparkles },
  { href: "/lab", label: "Visual Lab", icon: Compass },
  { href: "/storyboard", label: "Storyboard", icon: Film },
  { href: "/studio", label: "Asset Studio", icon: Palette },
  { href: "/assets", label: "Assets", icon: Folders },
  { href: "/export", label: "Export Kit", icon: ArrowUpRight },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isCloudinaryConnected, cloudName, setIsJudgeModalOpen } = useAppStore();

  const getPageTitle = () => {
    switch (pathname) {
      case "/create":
        return "Create Lesson";
      case "/lab":
        return "AI Visual Lab";
      case "/storyboard":
        return "Visual Storyboard";
      case "/studio":
        return "Asset Studio";
      case "/assets":
        return "Asset Library";
      case "/export":
        return "Export & Distribution Hub";
      default:
        return "Create Lesson";
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <JudgeViewModal />

      {/* Persistent Left Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-background-secondary border-r border-border-subtle flex flex-col justify-between p-4 sticky top-0 h-screen z-30">
        <div>
          {/* Brand Header */}
          <Link href="/create" className="block px-3 py-4 border-b border-border-subtle mb-5 group">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-accent-cyan group-hover:scale-105 transition-transform">
                ✦ EDUVISION
              </span>
            </div>
            <div className="text-[11px] text-text-muted font-medium mt-0.5">
              AI Visual Studio for Education
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname === "/" && item.href === "/create");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/25 shadow-cyan-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-background-hover"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent-cyan" : "text-text-muted"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cloudinary & Team Footer */}
        <div className="space-y-3 pt-4 border-t border-border-subtle">
          {/* Judge View Button */}
          <button
            onClick={() => setIsJudgeModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background-surface hover:bg-background-hover border border-accent-cyan/20 text-accent-cyan text-xs font-bold transition group"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Judge Pipeline View
            </span>
            <span className="text-[10px] bg-accent-cyan/20 px-1.5 py-0.5 rounded font-mono">TRACK 02</span>
          </button>

          {/* Cloudinary Status Indicator */}
          <div className="p-2.5 rounded-lg bg-background-surface border border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted tracking-wider uppercase font-mono">
                CLOUDINARY
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isCloudinaryConnected ? "bg-emerald-400 shadow-[0_0_6px_#34D399]" : "bg-amber-400 shadow-[0_0_6px_#FBBF24]"}`} />
                <span className={`text-[11px] font-bold font-mono ${isCloudinaryConnected ? "text-emerald-400" : "text-amber-400"}`}>
                  {isCloudinaryConnected ? "Connected" : "Demo CDN"}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-text-muted truncate mt-1 font-mono">
              Cloud: {cloudName}
            </div>
          </div>

          <div className="px-1 text-[11px] text-text-muted flex justify-between items-center">
            <span className="font-semibold text-text-secondary">ASTRAVEDA</span>
            <span className="text-[10px] font-mono">v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Header */}
        <header className="h-16 border-b border-border-subtle bg-background-secondary/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-muted font-mono uppercase">EDUVISION</span>
            <span className="text-text-muted text-xs">/</span>
            <h1 className="text-sm font-bold text-accent-cyan">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsJudgeModalOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/20 transition flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" /> Pipeline Inspector
            </button>

            <div className="px-3 py-1 rounded-full text-xs font-mono font-medium text-text-muted bg-background-surface border border-border-subtle">
              Track 02 · Powered by Cloudinary
            </div>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
