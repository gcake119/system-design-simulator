"use client";

import { AppShell } from "@/components/layout/app-shell";
import { LocalizationProvider } from "@/components/localization/LocalizationProvider";

export default function Home() {
  return <LocalizationProvider><AppShell /></LocalizationProvider>;
}
