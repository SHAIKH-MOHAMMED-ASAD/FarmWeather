"use client";

import { Header } from "@/components/header";
import { MainTabs } from "@/components/main-tabs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MainTabs />
      </main>
    </div>
  );
}
