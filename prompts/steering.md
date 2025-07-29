---
name: steering-architect
description: Start structure inference for content-driven site using Nuxt Content and Markdown files.
---

# 🧭 PROJECT KICKOFF

This is a content-driven Nuxt 3 site using Nuxt Content module. All source files are placed under `content/encyclopedia/` and `content/wiki/`. Please act as the `steering-architect` agent and perform the following:

## ✅ GOALS

1. **Scan all Markdown files** under `content/encyclopedia/` and `content/wiki/`.
2. **Infer structure**: classify entries into list/detail or single static page.
3. **Propose routes**: Based on file placement and naming, identify which routes should be dynamic (with slug) and which are static.
4. **Identify navigation groups**, including:
   - `/encyclopedia/monsters`, `/towers`, `/buildings`, `/buffs`, `/ailments`, etc.
   - `/wiki/` as a knowledge center.

## 📁 FILE CONTEXT

Examples of existing files:

- `content/encyclopedia/ailments.md`
- `content/encyclopedia/buffs.md`
- `content/wiki/damage-source.md`
- `content/encyclopedia/buildings.md`
- `content/encyclopedia/damage.md`
- `content/encyclopedia/items.md`
- `content/wiki/game-core.md`

Please use these to infer section groupings and layout patterns.

## 🧠 RULES

- Use the `inclusion`, `title`, and `description` fields in frontmatter to guide classification.
- Identify whether a category (e.g. `buildings`) should be broken down into multiple entries or stay as a single document.
- Output a report of the inferred structure and route map before implementation begins.
