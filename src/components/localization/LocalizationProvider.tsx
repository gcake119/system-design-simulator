"use client";

import { useEffect } from "react";
import zhTW from "@/lib/zh-tw.generated.json";

export type Locale = "zh-TW" | "en";
export const LOCALE_KEY = "systemforge-locale";
const translations = zhTW as Record<string, string>;
const phraseEntries = Object.entries(translations)
  .filter(([source, target]) =>
    source.length >= 6 && source.includes(" ") && !target.includes(source),
  )
  .sort(([a], [b]) => b.length - a.length);

function translate(value: string): string {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  const exact = translations[core];
  if (exact) return leading + exact + trailing;

  const addToCanvas = core.match(/^Add (.+) to canvas$/);
  if (addToCanvas) {
    return `${leading}將 ${translate(addToCanvas[1]).trim()} 加入 Canvas${trailing}`;
  }
  const showMore = core.match(/^Show (\d+) more$/);
  if (showMore) return `${leading}再顯示 ${showMore[1]} 項${trailing}`;
  const noMatches = core.match(/^No matches for [“"](.+)[”"]$/);
  if (noMatches) return `${leading}找不到符合「${noMatches[1]}」的結果${trailing}`;
  const componentMatches = core.match(/^(\d+) components? match [“"](.+)[”"]$/);
  if (componentMatches) {
    return `${leading}${componentMatches[1]} 個元件符合「${componentMatches[2]}」${trailing}`;
  }

  let localized = core;
  for (const [source, target] of phraseEntries) {
    if (localized.includes(source)) localized = localized.replaceAll(source, target);
  }
  return leading + localized + trailing;
}

function localize(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, code, pre")) continue;
    if (node.nodeValue) {
      const next = translate(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
  }
  const element = root instanceof Element ? root : null;
  const elements = [
    ...(element ? [element] : []),
    ...Array.from(root.querySelectorAll?.("[title], [aria-label], [placeholder], [alt]") ?? []),
  ];
  for (const el of elements) {
    for (const attr of ["title", "aria-label", "placeholder", "alt"]) {
      const value = el.getAttribute(attr);
      if (value) {
        const next = translate(value);
        if (next !== value) el.setAttribute(attr, next);
      }
    }
  }
}

export function getLocale(): Locale {
  if (typeof window === "undefined") return "zh-TW";
  return localStorage.getItem(LOCALE_KEY) === "en" ? "en" : "zh-TW";
}

export function setLocale(locale: Locale) {
  localStorage.setItem(LOCALE_KEY, locale);
  window.location.reload();
}

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const locale = getLocale();
    document.documentElement.lang = locale === "en" ? "en" : "zh-Hant-TW";
    if (locale === "en") return;

    localize(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE && added.nodeValue) {
            const next = translate(added.nodeValue);
            if (next !== added.nodeValue) added.nodeValue = next;
          } else if (added instanceof Element) {
            localize(added);
          }
        }
        if (record.type === "characterData" && record.target.nodeValue) {
          const next = translate(record.target.nodeValue);
          if (next !== record.target.nodeValue) record.target.nodeValue = next;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return children;
}
