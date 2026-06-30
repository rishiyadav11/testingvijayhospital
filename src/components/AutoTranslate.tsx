"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "SVG",
  "PATH",
]);

const hasLatin = (s: string) => /[A-Za-z]/.test(s);
const hasDevanagari = (s: string) => /[ऀ-ॿ]/.test(s);

// node -> original English value, so we can restore on switching back to EN.
const originals = new Map<Text, string>();

function collectNodes(): Text[] {
  if (typeof document === "undefined" || !document.body) return [];
  const out: Text[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const raw = node.nodeValue || "";
      const core = raw.trim();
      if (core.length < 2) return NodeFilter.FILTER_REJECT;
      if (!hasLatin(core)) return NodeFilter.FILTER_REJECT;
      if (hasDevanagari(core)) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

async function fetchTranslations(uniq: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  const need: string[] = [];

  for (const t of uniq) {
    let cached: string | null = null;
    try {
      cached = localStorage.getItem("hi::" + t);
    } catch {
      cached = null;
    }
    if (cached) map[t] = cached;
    else need.push(t);
  }

  const CHUNK = 40;
  for (let i = 0; i < need.length; i += CHUNK) {
    const chunk = need.slice(i, i + CHUNK);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: chunk }),
      });
      if (!res.ok) continue;
      const { translations } = await res.json();
      chunk.forEach((src, j) => {
        const tr = translations?.[j];
        if (typeof tr === "string" && tr.length > 0) {
          map[src] = tr;
          try {
            localStorage.setItem("hi::" + src, tr);
          } catch {
            /* quota — ignore */
          }
        }
      });
    } catch {
      /* network hiccup — leave these in English */
    }
  }
  return map;
}

async function applyHindi() {
  const nodes = collectNodes();
  if (nodes.length === 0) return;

  const pending: { node: Text; raw: string; core: string }[] = [];
  const uniq = new Set<string>();
  for (const node of nodes) {
    const raw = node.nodeValue || "";
    const core = raw.trim();
    if (!core) continue;
    pending.push({ node, raw, core });
    uniq.add(core);
  }
  if (uniq.size === 0) return;

  const map = await fetchTranslations([...uniq]);

  for (const { node, raw, core } of pending) {
    if (!node.isConnected) continue;
    if (hasDevanagari(node.nodeValue || "")) continue; // already translated
    const tr = map[core];
    if (tr && hasDevanagari(tr)) {
      if (!originals.has(node)) originals.set(node, node.nodeValue || "");
      const lead = raw.match(/^\s*/)?.[0] ?? "";
      const trail = raw.match(/\s*$/)?.[0] ?? "";
      node.nodeValue = lead + tr + trail;
    }
  }
}

function restoreEnglish() {
  for (const [node, en] of originals) {
    if (node.isConnected) node.nodeValue = en;
  }
  originals.clear();
}

export default function AutoTranslate() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (lang !== "hi") {
      restoreEnglish();
      return;
    }

    let cancelled = false;
    const run = () => {
      if (!cancelled) applyHindi();
    };

    // initial pass + a couple of follow-ups for late-rendering content
    run();
    const t1 = setTimeout(run, 600);
    const t2 = setTimeout(run, 1800);

    const schedule = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(run, 400);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      if (timer.current) clearTimeout(timer.current);
      observer.disconnect();
    };
  }, [lang, pathname]);

  return null;
}
