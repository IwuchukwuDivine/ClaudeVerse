import type { Component } from "vue";

export type AccentKey =
  | "home"
  | "foundations"
  | "workflows"
  | "extensions"
  | "tokens"
  | "orchestration"
  | "evals"
  | "recipes"
  | "troubleshooting"
  | "resources"
  | "workshops"
  | "cheatsheet"
  | "reviews";

export interface NavLink {
  title: string;
  path: string;
  hash?: string;
}

export interface NavSection {
  slug: string;
  title: string;
  path: string;
  icon: Component | string;
  accent: AccentKey;
  tagline: string;
  description: string;
  estReadTime?: string;
  children?: NavLink[];
}

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}
