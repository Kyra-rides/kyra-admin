<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# kyra-admin — Kyra workspace scope

This is the **Admin** portal. The user of this app is Kyra ops staff — safety
officers, fleet managers, support agents. Build only features that an *ops
staff member* does at a desktop. (This is a web app, not mobile.)

## Belongs here
- Driver onboarding queue (review applications, approve, reject)
- Live ride monitoring, fleet map view
- Incident dashboard (SOS alerts, escalation routing)
- Driver deactivation, 3-strike framework, appeals
- Pricing, zone configuration, surge override
- Transparency report generation
- Analytics dashboards

## Does NOT belong here
- Anything a rider does → build in `../kyra-rider/`
- Anything a driver does → build in `../kyra-driver/`

## Branches
Default to **`feat/shivansh`** (Shivansh's branch) for all feature work.
Switch to it and merge `main` before building:

```bash
git checkout main && git pull
git checkout feat/shivansh && git merge main
```

The other teammate branches (`feat/divyashri`, `feat/latisha`, `feat/dev`,
`feat/avni`) are reserved for future engineers; do not commit to them
unless explicitly asked. Never build features directly on `main`.

## Workspace context
For workspace-wide routing rules and strategy docs, see `../AGENTS.md`
and the parent `/Kyra/` folder.
