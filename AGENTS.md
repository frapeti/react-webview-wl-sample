# AGENTS.md — react-webview-wl-sample

Agent operating guide for `react-webview-wl-sample`. This repository is iterated by AI agents; this file is the index that relates every spec in `specs/` and defines how agents should act.

## Overview

React Native WebView sample for white label web integration

## Spec index

- [specs/README.md](specs/README.md) — catalog of all specs and their purposes.
- [specs/product-overview.md](specs/product-overview.md) — business context, value, customers, and ecosystem relationships.
- [specs/architecture.md](specs/architecture.md) — tech stack, databases, models, modules, CI, local development, deployment, and testing.

## Agent operating rules

1. **Preserve external constants.** Database names, connection hosts, Firebase/GCP/Azure resource IDs, city IDs, API base URLs, bucket names, and any configuration coming from services or projects outside this repository must be kept exactly as-is. Never invent replacements.
2. **Keep specs truthful.** Specs and code must never conflict. After any material change, update the affected specs and this file in the same session.
3. **World-class code quality.** Match existing patterns, handle errors explicitly, add/update tests when this repository's practice expects them, and avoid unrelated refactors.
4. **Security.** No secrets in source, logs, or specs. Use environment variables/secret managers already used by the product; preserve authN/authZ and multi-tenant isolation; validate inputs at trust boundaries; prefer least privilege.
5. **UX/UI (where this repo has a UI).** Meet world-class UX/UI standards: clear hierarchy, accessible contrast/focus, responsive layout, consistent spacing/typography, and complete loading/empty/error states.
6. **English only.** Code, comments, specs, and commits in English, except user-facing strings/translations.
7. **Parallelize.** Use parallel subagents for independent analysis, domains, or modules.
8. **Local run, CI, deploy, testing.** See [specs/architecture.md](specs/architecture.md) and the repository README.

## Quick start

> # Embeber tu White Label Ualabee en una app React Native Este repositorio cumple dos fines: 1. **Demostración** – Una app de ejemplo que puedes ejecutar para ver cómo tu **white label de Ualabee** funciona embebida en una aplicación móvil (React Native con Expo), con WebView y geolocalización. 2. **Referencia de código** – Sirve como guía para que, en tu propia app React Native (nueva o ya existente), sepas cómo embeber el white label: qué componentes usar, cómo configurar permisos y cómo hacer que la geolocalización esté disponible dentro del WebView. Puedes usar este proyecto tal cual cambia
