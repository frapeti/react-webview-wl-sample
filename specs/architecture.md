# Architecture — react-webview-wl-sample

> Keep this document synchronized with the code. If code and this spec conflict, fix the spec (unless the code is wrong).

## Tech stack
- Primary language: TypeScript.
- Package: `react-webview-wl-sample`.
- Key dependencies: `expo`, `expo-location`, `expo-status-bar`, `react`, `react-native`, `react-native-safe-area-context`, `react-native-webview`.

## Repository layout
```
App.tsx
README.md
app.json
assets/
docs/
eas.json
index.ts
package-lock.json
package.json
tsconfig.json
```

## Modules / components
Main directories (review each directory for full details):

- `assets/` — see contents in the repository; purpose inferred from naming and README.
- `docs/` — see contents in the repository; purpose inferred from naming and README.

## Data & models
No data-related environment keys detected from `.env.example`. Inspect config files for databases/queues/state.

## CI / CD
No CI/CD files detected in this repository.

## Local development
npm scripts: `start`, `android`, `ios`, `web`.
See the repository README for run instructions; if absent, no local run steps are documented.

## Deployment
See CI workflows and infra files listed above. If deployment steps are documented in the README or `specs/`, they take precedence.

## Testing
No test files/directories detected at the root level.
