---
name: update-handbook
description: Keeps HOSTING.md accurate as the site changes. Use whenever work touches hosting, DNS, the domain, GitHub Pages settings, the deploy workflow, repository access, or HTTPS — and whenever a problem listed in HOSTING.md is fixed or a new one is found. Triggers on "DNS", "domain", "GoDaddy", "Pages settings", "custom domain", "certificate", "HTTPS", "workflow", "deploy", "Actions", "renewal", or any change that would make a statement already in HOSTING.md wrong.
---

# Keeping HOSTING.md accurate

`HOSTING.md` is this chapter's handover document. NSBE MUN already lost one
domain — `nsbemun.ca` — in part because how the site worked lived in one
person's head. The handbook only prevents a repeat if it stays true.

**A wrong handbook is worse than no handbook.** It sends the next exec chasing
problems that no longer exist, or reassures them about something that has since
broken.

## Update it when

- **Hosting, DNS, or the domain changes** — a record added or removed at GoDaddy,
  a new domain, a change of registrar or host, nameserver changes
- **GitHub Pages settings change** — custom domain, HTTPS enforcement, build
  source, visibility
- **The deploy pipeline changes** — anything under `.github/workflows/`, the
  branch that deploys, or the `CNAME` file
- **Access or ownership changes** — who administers the org, the repo, or the
  GoDaddy account
- **A listed known issue is fixed** — delete the entry, don't leave it "resolved"
- **A new lasting problem is found** — add it to Known issues with enough detail
  to act on
- **A dated fact passes** — certificate expiry, renewal dates, "at time of writing"
  claims

## Don't update it for

Routine site content: copy edits, new photos, styling, team roster changes, page
layout. The handbook documents *how the site is operated*, not what it says. Adding
churn for content changes makes it noisy, and a noisy doc stops being read.

## How to do it

**Same PR as the change.** Not a follow-up — a follow-up is how documentation
drifts. If a PR changes DNS or the workflow, the handbook edit belongs in that
same PR.

**Check for statements the change makes false.** This is the part that gets
missed. Search the whole file, not just the section you are editing:

```bash
grep -n "at time of writing\|expires\|currently\|as of" HOSTING.md
```

A change to hosting often invalidates a sentence three sections away.

**Match the existing voice.** Plain, specific, and honest about what is broken.
Say what will happen and what to do, not what is "recommended". Keep the tables
and the symptom-first structure of the troubleshooting section.

**Never quietly delete a known issue.** Remove it only when it is genuinely fixed,
and say so in the commit message so the history explains why it went.

## Worked example

The handbook once listed, under Known issues, that `http://nsbe-mun.ca` returned a
404. It was a transient GitHub edge-propagation delay and it cleared on its own.
The entry also suggested removing and re-adding the custom domain as a fix — which
by then would have destroyed a working TLS certificate and triggered a fresh
24-hour reissue for no reason.

Left in place, that note was actively harmful. Removing it was the update.

## Facts most likely to go stale

| Fact | Where | Why it drifts |
|---|---|---|
| Certificate expiry date | HTTPS section | Renews roughly every 90 days |
| Domain renewal date | At a glance | Annual |
| Known issues list | Known issues | Things get fixed and nobody edits the doc |
| DNS record values | DNS table | Rarely, but breaks everything when wrong |
| Who has access | Handing this over | Every exec turnover |

## If unsure

Ask whether someone inheriting this site next year, reading only `HOSTING.md`,
would be misled. If yes, update it. If it makes no difference to them, leave it
alone.
