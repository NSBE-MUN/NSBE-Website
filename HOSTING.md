# Keeping nsbe-mun.ca online

Everything the next exec needs to publish changes, fix the site when it breaks,
and — most importantly — not lose the domain.

*Written August 2026, when the site was first successfully published.*

---

## At a glance

| | |
|---|---|
| **Live at** | <https://nsbe-mun.ca> |
| **Domain registrar** | GoDaddy |
| **Host** | GitHub Pages |
| **Repository** | `NSBE-MUN/NSBE-Website` (public) |
| **Deploys from** | `main` branch |
| **Hosting cost** | $0.00 |
| **Only recurring bill** | Domain renewal at GoDaddy |

### ⚠️ The chapter has already lost one domain

The previous address, **nsbemun.ca**, is no longer owned by NSBE MUN — it lapsed
and is gone. Every poster, QR code, and social link pointing at it is dead.

Domain renewal is the single point of failure in this entire setup. The hosting
is free and self-maintaining, but if the registration lapses the site becomes
unreachable and someone else can buy the name.

**A renewal reminder is set in a shared calendar** (August 2026). Confirm each
year that it still exists and that whoever owns it hasn't graduated — a reminder
sitting in a departed exec's personal calendar is the same as no reminder.

The date itself isn't recorded here, since this repo is public. Look it up in
GoDaddy, or run `whois nsbe-mun.ca` and read the expiry field.

---

## How a change goes live

Nothing is deployed by hand and there is no server to log into. Publishing is a
side effect of merging.

1. **Branch off `main`.** Never edit `main` directly:
   `git checkout -b fix/broken-link`
2. **Open a pull request** against `main`. This is the review step, and it
   doubles as the handover record for whoever inherits the site next.
3. **Merge it.** Merging to `main` is what triggers publication. Nothing else does.
4. **GitHub Actions builds and deploys.** The workflow at
   `.github/workflows/static.yml` uploads the repository as-is and hands it to
   GitHub Pages. Takes about 20 seconds. Watch it under the repo's **Actions** tab.
5. **It's live.** Changes appear at `nsbe-mun.ca` within a minute. Hard-refresh
   before assuming something is broken.

> **There is no build step.** The site is plain HTML, CSS, and JavaScript with
> Bootstrap. What's in the repo is exactly what gets served — no compiler, no
> framework, no `npm install`. Open `index.html` in a browser to preview locally.

### Will this ever start costing money?

No. GitHub Actions is **free with unlimited minutes for public repositories**, and
this repo is public — so deploys never run out and never generate a bill. (The
2,000-minutes-per-month cap people mention applies only to *private* repos.)

GitHub Pages itself has a 1 GB site-size limit and a *soft* 100 GB/month bandwidth
limit. This site is around 20 MB and a student chapter will not come close to the
bandwidth figure — and because it's soft, GitHub emails rather than cutting you off
or charging. The 10-builds-per-hour limit does not apply here, as GitHub exempts
custom Actions workflows like ours.

**The domain renewal remains the only thing anyone ever has to pay for.**

---

## The DNS records

These live in GoDaddy under **Domain → DNS**. They are correct as of August 2026
and should not need touching again. The reason to understand them is so you know
what *not* to delete.

| Type | Name | Points to | What it does | Status |
|---|---|---|---|---|
| A ×4 | `@` | `185.199.108.153`<br>`185.199.109.153`<br>`185.199.110.153`<br>`185.199.111.153` | Sends `nsbe-mun.ca` to GitHub's servers. Four addresses for redundancy — all four required. | **Don't touch** |
| AAAA ×4 | `@` | `2606:50c0:8000::153`<br>`2606:50c0:8001::153`<br>`2606:50c0:8002::153`<br>`2606:50c0:8003::153` | Same thing for IPv6 networks. Some mobile carriers need these. | **Don't touch** |
| CNAME | `www` | `nsbe-mun.github.io` | Makes `www.nsbe-mun.ca` work; GitHub redirects it to the bare domain. | **Don't touch** |
| TXT | `_github-pages-challenge-nsbe-mun` | `0af51b8b…` | Proves NSBE MUN owns this domain, so nobody else can claim it on GitHub Pages if the repo is ever deleted. | **Keep forever** |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine…` | Email anti-spoofing. Unrelated to the website — stops people faking `@nsbe-mun.ca` senders. | Leave alone |
| NS ×2 | `@` | `ns07`/`ns08.domaincontrol.com` | Tells the internet GoDaddy answers DNS for this domain. Deleting these breaks everything at once. | **Don't touch** |
| SOA | `@` | `ns07.domaincontrol.com` | Standard zone metadata. GoDaddy manages it; not editable. | Automatic |
| CNAME | `_domainconnect` | `_domainconnect.gd.domaincontrol.com` | GoDaddy's own setup helper. Harmless, safe to ignore. | Automatic |

### ⚠️ The `CNAME` file is not the same as a CNAME record

There is a file named `CNAME` in the root of this repository containing the
single line `nsbe-mun.ca`. It is unrelated to the DNS record above, and it must
match the domain exactly.

Editing or deleting it will take the site offline on the next deploy. This is
precisely how the site was broken before — the file still named the old lapsed
domain, which meant the first deploy would have pointed the site at an address
the chapter no longer controlled.

---

## HTTPS and the padlock

Handled automatically. Documented so nobody panics or pays for something already free.

GitHub issues a free Let's Encrypt certificate covering `nsbe-mun.ca` and
`www.nsbe-mun.ca`, and renews it roughly every 90 days without anyone doing
anything. The certificate in place at time of writing expires **24 November 2026**
and will renew itself well before then.

**Enforce HTTPS** is switched on in **Settings → Pages**, so visitors always get
the encrypted version.

> **Never buy an SSL certificate for this domain.** GoDaddy will offer to sell
> you one. It would be a waste of chapter funds — GitHub provides it free.

---

## When something breaks

Symptoms in rough order of likelihood. Work top down.

<details>
<summary><strong>My change isn't showing up on the site</strong></summary>

**Most likely cause:** the change is sitting on a branch that was never merged
into `main`. Deploys only ever run from `main`.

**Check:** open the repo's **Actions** tab. A green tick next to a recent run
means it deployed; no run at all means nothing triggered.

**Also rule out:** browser cache. Hard-refresh (`Cmd+Shift+R`) before
investigating further.
</details>

<details>
<summary><strong>The site shows "There isn't a GitHub Pages site here"</strong></summary>

**Most likely cause:** the `CNAME` file in the repo root was edited, deleted, or
no longer matches the custom domain in **Settings → Pages**.

**Fix:** confirm the file contains exactly `nsbe-mun.ca` on one line — no
`https://`, no `www`, no trailing slash. Then check **Settings → Pages** still
shows the same domain with a green "DNS check successful".
</details>

<details>
<summary><strong>The whole domain stopped working</strong></summary>

**Check first:** whether the domain registration lapsed. Log into GoDaddy and
look at the renewal date before touching anything else — this is the failure that
killed the old domain.

**Then check:** that the DNS records in the table above are all still present. A
well-meaning edit that removes the A records will take the site down within minutes.
</details>

<details>
<summary><strong>Browser warns the connection isn't secure</strong></summary>

**Most likely cause:** the certificate is mid-renewal, or the custom domain was
recently re-saved, which restarts certificate issuance from scratch.

**Fix:** wait. Issuance takes minutes to an hour, occasionally up to 24 hours.

**Do not** repeatedly re-save the domain in **Settings → Pages** — each save
cancels the in-progress request and starts over, which is what turns a short wait
into a long one.
</details>

<details>
<summary><strong>A deploy failed with a red X in Actions</strong></summary>

**Where to look:** click the failed run in the **Actions** tab and read the log
for the step that failed. The error is usually literal about what went wrong.

**Safe recovery:** the previously deployed version stays live when a deploy
fails — the site does not go down. Fix the problem on a branch, open a PR, and
merge again.
</details>

---

## Handing this over

All of it is organisation-owned rather than tied to an individual, which is the
main reason GitHub Pages was chosen over Netlify, Vercel, and Cloudflare Pages.

- **GitHub organisation access.** Add the next exec to the `NSBE-MUN`
  organisation with admin on `NSBE-Website`. Because the site belongs to the
  organisation and not a personal account, nothing needs migrating when execs change.
- **GoDaddy account credentials.** This is the weak link — a registrar login is a
  shared secret, not a permission you can grant. Store it wherever the chapter
  keeps shared credentials and confirm at least two current execs can get in.
- **The renewal reminder.** Already set in a shared calendar. Verify it survived
  the handover and still points at someone currently in the chapter. Also check
  auto-renew is on, and on a card that won't expire with a graduating student —
  auto-renew is the real protection, the calendar is the backup for when the card
  fails.
- **This document.** Keep it updated as things change.

---

## Known issues and unfinished work

Recorded honestly so nobody rediscovers them the hard way.

- **The contact form does nothing.** The form on `contact.html` has no submit
  destination, so messages are silently discarded — nobody receives them. Either
  wire it to a free service such as Formspree, or replace it with a link to a
  Google Form like the membership one. Until then it quietly loses enquiries.
- **The new address isn't published anywhere off-site.** Nothing in this repo
  references the dead `nsbemun.ca` — the site uses relative links throughout, and
  the only `nsbemun` string left is the Gmail address on the contact page, which
  is unaffected by the lost domain. The gap is external:
  - **MUNSU** (`munsu.ca/nsbe`) lists **no website at all**, so `nsbe-mun.ca`
    needs adding rather than correcting. It also links a Facebook *group*
    (`groups/973686196937262`) while this site's footer links a Facebook *page*
    (`NSBE-MUN-102221058869179`) — worth deciding which is canonical.
  - **Instagram, LinkedIn, and Facebook** bios need checking by hand. These can't
    be verified programmatically, so someone has to open each one.
- **Some images are heavy.** Several homepage photos exceed 1 MB — the IT
  Director's `Emeka.png` is 1.9 MB, and a few carousel slides are larger still.
  Photographs saved as PNG are the main offender; re-encoding them as JPEG
  typically cuts them by ~85% with no visible difference at the size they render.
  Easy improvement with no risk to the hosting setup.
- **Team card links are placeholders.** Several LinkedIn buttons on the team cards
  still point at `#`.
- **This README isn't formatted.** `README.md` is plain text with no Markdown
  headings, so GitHub renders it as one unbroken wall. Worth a cleanup pass.

---

## Keeping this document accurate

A wrong handbook is worse than no handbook — it sends people chasing problems that
no longer exist. Update this file **in the same pull request** as any change to
hosting, DNS, the domain, Pages settings, the deploy workflow, or who has access.
Delete known issues once they are genuinely fixed.

Routine content changes — copy, photos, team roster — don't belong here. This
document covers how the site is *operated*, not what it says.

There is a skill at `.claude/skills/update-handbook/` that prompts Claude Code to
do this automatically when it makes a relevant change. It's guidance rather than
enforcement, so it's still worth checking by eye.

---

*If you're reading this because something broke, start at
[When something breaks](#when-something-breaks) — and check the domain renewal
date before anything else.*
