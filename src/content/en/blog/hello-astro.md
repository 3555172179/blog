---
title: Building a Personal Blog with Astro 5
description: Build a fast, SEO-friendly personal blog from scratch with Astro 5 and Tailwind CSS v4.
pubDate: 2026-08-27
tags: [astro, blog, tutorial]
category: study
---

## Why Astro

Astro ships **zero JavaScript** by default. The build output is close to raw static HTML, which means Lighthouse scores near perfect.
For a content-first personal blog, that's exactly the right shape: fast, stable, and SEO friendly.

## Tech stack

- Framework: Astro 5
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite`)
- Content: Content Collections (two collections: blog + notes)
- Deployment: Vercel

## Posts and notes

This site distinguishes between two kinds of content:

1. **Posts** — full articles with table of contents, tags, and descriptions.
2. **Notes** — short-form quick captures with a simpler layout.

Both share the same rendering pipeline but live in independent content collections.

## Dark mode

Implemented with the `class` strategy — toggle `.dark` on the `<html>` element.
Before first paint we read the stored theme from `localStorage` to avoid a flash.

## What's next

The following will be added incrementally:

- Comments (Cusdis)
- Site-wide search (Fuse.js)
- Email subscription (Buttondown)
- Social share buttons
- Personal workspace at `/workspace.html`

Stay tuned.