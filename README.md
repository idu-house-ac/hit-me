# HIT ME pitch page

A single scrolling page that pitches the HIT ME pilot to potential funders. Static HTML, CSS and a small amount of JavaScript. No backend, no analytics, no third-party requests (fonts are self-hosted).

Live address once DNS is set: **https://pitch.iduhouse.com/**

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page, copy included |
| `css/styles.css` | Design tokens and layout |
| `js/main.js` | Scroll reveals, nav state, five-day board tabs, budget bar, parallax |
| `fonts/` | Anton and Inter (latin subsets), self-hosted |
| `images/src/` | Put the five original images here (see below) |
| `images/` | Generated responsive sizes, plus `og.jpg` for link previews |
| `scripts/build-images.py` | Regenerates `images/` from `images/src/` |
| `CNAME` | Custom domain for GitHub Pages |

## Images

The page currently ships with **flat placeholder images**. To swap in the real ones:

1. Copy the five originals into `images/src/`, named exactly `apartment.jpg`, `office.jpg`, `kitchen.jpg`, `casings.jpg`, `alley.jpg`.
2. Run:

   ```bash
   python3 scripts/build-images.py
   ```

   (Needs Pillow: `pip install pillow`.) This writes 640, 1024, 1536 and 1792 px JPEG and WebP versions, plus `images/og.jpg`.
3. Commit and push.

## Deploying

The site is served by GitHub Pages from the `main` branch root.

**One-time GitHub step:** in the repo go to Settings, Pages. Under "Build and deployment" set Source to "Deploy from a branch", pick `main` and `/ (root)`, and save. The `CNAME` file in the repo fills in the custom domain automatically. The page is then live at https://idu-house-ac.github.io/hit-me/ within a minute or two, and at pitch.iduhouse.com once DNS is set.

**One-time DNS step (Squarespace):** in the iduhouse.com domain's DNS settings add a CNAME record:

| Host | Type | Value |
| --- | --- | --- |
| `pitch` | CNAME | `idu-house-ac.github.io` |

Then in the GitHub repo under Settings, Pages, confirm the custom domain reads `pitch.iduhouse.com` and tick "Enforce HTTPS" once the certificate is issued (can take up to an hour after DNS propagates).

## Decisions and switches

- **Investment row.** Pending legal review. To remove it, delete the single `<li id="route-investment">` line in `index.html` (it is marked with a comment). The card heading `Four ways to back it` is copy from the brief and would also need Aaron's call if the row goes.
- **Budget detail.** Per Aaron, the page shows the $41,000 target, the proportional bar and the four bucket totals only. Itemized lines are deliberately not on the page.
- **Directors' statement.** Confirmed by Aaron as final. The `DRAFT FOR REVIEW` tag from the mockup is not shipped.
- **Request the script.** Every button is a `mailto:` to aaron@iduhouse.com with the subject `Hit Me script request`. The address is also shown as plain text near each button.
- **Access.** Public and indexable.

## Launch checklist

- [ ] Real images in `images/src/`, `build-images.py` run, result committed
- [ ] DNS CNAME added in Squarespace, HTTPS enforced on GitHub Pages
- [ ] Legal call on the Investment row
- [ ] Open the live page on a phone and a desktop once
