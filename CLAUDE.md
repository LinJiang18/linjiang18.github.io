# CLAUDE.md

Lin Jiang's academic homepage (https://linjiang18.github.io): al-folio v1.x, deployed to GitHub Pages by GitHub Actions only. **No local build, no Ruby installed** — a change is verified by the `Check` run (any branch / PR) or `Deploy site` (push to `main`) and the live page. The theme lives entirely in the `al_folio_*` gems (exact-pinned; Dependabot bumps them). There is no upstream remote. Migrated in 2026-09 from the al-folio v0.x starter repo to this layout, which was taken from Dahai Yu's site (UFOdestiny.github.io). al-folio's dev scaffolding (docs, Docker, npm/prettier/purgecss, `bin/`, the ~17 CI workflows, demo posts/projects/books) was removed on purpose — don't bring it back, and ignore upstream contributor docs; they describe the starter repo.

To read a gem's real templates without Ruby:

```bash
curl -sO https://rubygems.org/downloads/al_folio_core-1.0.15.gem   # version from Gemfile.lock
tar xf al_folio_core-1.0.15.gem && tar xzf data.tar.gz             # -> _sass/ _layouts/ _includes/
```

## Config is trimmed to what renders

`plugins:` in `_config.yml` and the `Gemfile` must list the same gems (one in only one list is inert; `tools/check.py` enforces it). Transitive deps (`css_parser`, `observer`) are not listed. When editing the `Gemfile`, keep `Gemfile.lock`'s `DEPENDENCIES` in step — CI installs in frozen mode.

Looks removable, isn't:

| Item | Why it stays |
| --- | --- |
| `jekyll-toc` | `post.liquid` calls `{% toc %}` unconditionally |
| `al_citations` | same, from `selected_papers.liquid` |
| `jemoji` | `news.liquid` pipes through `emojify` |
| `jekyll-email-protect` | `al_search` pipes the email through `encode_email`; without the gem Liquid drops the filter silently and the email ships as plaintext in the search index |
| `al_folio.distill.source` | `al_folio_core` warns without it |
| `enable_publication_thumbnails: true` | gates the whole left column of `bib.liquid`: venue badge *and* thumbnail |
| `google_site_verification` | Set 2026-09-28 for the URL-prefix property https://linjiang18.github.io/. Search Console re-checks it; removing it un-verifies the property and drops the sitemap submission. Token must come from a **URL-prefix** property verified by **HTML tag** (a Domain property needs DNS on github.io, which we don't control) |

Deliberately off — to re-enable, restore every piece listed:

- **Math**: `enable_math: true`, `al_math` in both lists, `mathjax` in `third_party_libraries`.
- **Other CDN libraries**: `third_party_libraries` lists only the six this site can request. The rest are gated on page flags no page sets or on gems not loaded (`al_charts`, `al_cookie`, `al_analytics`, `al_folio_distill`).
- **RSS**: `jekyll-feed` in both lists + uncomment `rss_icon` in `_data/socials.yml`.
- **X/Twitter**: removed from `metadata.liquid` and `socials.yml`; no X presence.

## The eleven local theme files

Each gem copy keeps the gem's code verbatim apart from edits marked `Local change:` (only its comments were reflowed to one line per paragraph), so a theme upgrade stays diffable. Prefer `_config.yml` or content over adding a twelfth.

- `_includes/metadata.liquid` — appends `tagline` to the home `<title>`; renders `google_site_verification`; drops the Twitter card and `x_username` sameAs case; guards the gem's `null` in `sameAs`; fixes invalid JSON-LD `description`; emits a schema.org `ProfilePage`/`Person` (from `person:` in `_config.yml`) on `/` only.
- `_includes/news.liquid` — inline news show `item.excerpt` instead of the whole `item.content`, so anything after an `excerpt_separator` (e.g. certificate images) stays on the item's own page instead of blowing up the news table's width.
- `_includes/selected_papers.liquid` — the home page's papers and their order: a `nocite` list + `--cited_in_order`, instead of the gem's `selected={true}` query (which follows .bib file order, the same order /publications/ uses within a year). There is no `selected` field in papers.bib.
- `_layouts/bib.liquid` — one addition under the venue badge: CCF / CORE rank pills from `ccf` / `core` in `_data/venues.yml` (CCF keyed by list edition, the entry takes the newest edition not newer than its year; CORE is the latest ICORE edition only). Styled in `_local.scss`.
- `_layouts/about.liquid` — portrait alt from `page.profile.image_alt`; capitalised section headings.
- `_sass/_footer.scss` — flex body to full viewport height so the footer sits at the bottom of short pages.
- `assets/js/theme.js` — the theme toggle has two states (light/dark), not the gem's three (light/dark/system): `toggleThemeSetting` flips, and `determineThemeSetting` maps nothing-stored or a stored `system` to the OS preference. Everything else is the gem's file verbatim.
- `assets/css/main.scss` — the gem's entry file, minus the `tabs`/`teachings`/`typograms` partials, plus a trailing `@use "local"`.
- `_sass/_local.scss` — our CSS: FSU garnet accent (`#782f40` light, `#c96a80` dark) on `--global-theme-color`/`--global-hover-color`; `--local-year-color` for the `/publications/` year headings and buttons (the gem paints the headings in the divider colour, 1.25:1); dark-mode fix for the `/publications/` filter box; bold own name in author lists; the **1rem reading floor**.
- `_plugins/social_link_labels.rb` — real labels + `aria-label` for navbar social icons (jekyll-socials derives "Github username" etc. from the key). Add to `LABELS` when adding a social with an ugly key.
- `_plugins/prune_theme_assets.rb` — deletes ~350 KB of theme assets no page requests (`exclude:` can't; the theme-assets reader ignores it). Not `jupyter_new_tab.js`: `scripts.liquid` loads it on every page.

Sass gotchas:

- **Shadowing `_sass/_variables.scss` does not work.** Dart Sass resolves `@use` relative to the importing file first, so the gem's `_themes.scss` always gets the gem's copy. Only partials `@use`d directly by `assets/css/main.scss` can be shadowed.
- The 1rem floor exempts badges, icons, monospace and the footer. The footer is a hard constraint: the copyright line is 915px at 1rem vs 900px available, so it only fits at the gem's 0.9rem — re-measure before editing `footer_text`.

Compile the CSS locally (output is byte-identical to the deploy's apart from `$max-content-width`):

```bash
cd "$(mktemp -d)" && curl -sO https://rubygems.org/downloads/al_folio_core-1.0.15.gem
tar xf al_folio_core-1.0.15.gem && tar xzf data.tar.gz
python3 -c "s=open('REPO/assets/css/main.scss').read().split('---',2)[2]; open('entry.scss','w').write(s.replace('{{ site.max_width | default:  \"930px\" }}','930px'))"
npx --yes sass@1 --style=compressed --no-source-map --load-path=REPO/_sass --load-path=_sass entry.scss out.css
```

Measure whether text fits on one line: fetch Roboto 300's TTF from `https://fonts.googleapis.com/css?family=Roboto:300`, then `PIL.ImageFont.truetype(ttf, 14.4*64).getlength(text)/64` vs 900px (PIL skips kerning, so it errs wide — the safe direction).

## Content

| Change | File |
| --- | --- |
| Bio, photo, blurbs | `_pages/about.md` |
| Publications | `_bibliography/papers.bib`; home page picks in `_includes/selected_papers.liquid` |
| News | `_news/YYYY-MM-DD-slug.md` |
| Experience (the CV page, `/experience/`) | `_data/cv.yml`, in this site's own compact format (`title`+`year` = award, `line` = bullet), rendered by the Liquid and inline CSS in `_pages/cv.md`. The `al_folio_cv` plugin was removed on purpose (its date-badge layout is not the look wanted); don't bring it back for this page |
| Activities page (`/activities/`): talks, academic service, friends | `_pages/activities.html` (its CSS is inline in the page) |
| Socials / coauthors / badge colours | `_data/socials.yml` / `coauthors.yml` / `venues.yml` |
| Site metadata, flags | `_config.yml` |

- Page titles are Capitalised (`About`, `Publications`, `News`, `Experience`, `Activities`): `title` is both navbar label and `<h1>`. Navbar order is `nav_order` in `_pages/`. `/experience/` is the URL the v0 site used; keep it. The v0 Research page lived at `/projects/`: `_pages/projects.md` is now only a `redirect:` stub to `/activities/` (kept out of the sitemap) so old links still land. Academic service lives on Activities, not in `_data/cv.yml`.
- `/publications/` builds its year jump nav by capturing `{% bibliography %}` and adding ids with `regex_replace` — nothing to maintain per year. The theme's `bibsearch.js` turns any URL hash into a filter term, so a small script in that page makes a year hash (`#2021`) clear the filter and scroll instead; without it, `#2021` listed every entry whose text mentions 2021. Per-entry anchors (`/publications/#jiang2026e4gen`) come from the gem.
- Always write IMWUT as `IMWUT/UbiComp` in anything a visitor reads (badge, bio, news, service list) — the user's standing preference. Official casing is `UbiComp`.
- Venue badges are white text on the colour, so each colour needs ~5:1 against white. `arXiv` is a badge, not a venue: every entry without a DOI is a preprint, and its `note` carries the status.

### Publication metadata

Entries shared with Dahai Yu's site were taken from it (verified there against Crossref, DBLP and the arXiv API; abstracts are the authors' own). The rest come from the v0 site.

- Published paper: `doi` (the DOI button already reaches the publisher page), preprint kept only as `arxiv`. No `html` field on any entry: it duplicated the DOI or arXiv button. **Never add a second entry for the preprint.**
- `note` = status line only ("Submitted to AAAI 2027.", co-first authors); no track names, and no "To appear." on accepted papers — the venue badge already says where it appears.
- Only claim pages, volumes and author lists you can source. GeoGen (`10.1609/aaai.v40i2.37111`): the published author list has no Dahai Yu, even though DBLP and Scholar list him — go by the publisher.
- Co-first authors: `*` after the last name (`Jiang*, Lin`) — the gem superscripts `*∗†‡§¶‖&^`, not `+`.
- `code` = the "Code" button. Set on a hand-picked list (E4GEN, SynHAT, HealthMamba, EnergyMamba, GeoGen, UQGNN), not on every paper with a public repo; ask before adding more. Point it at the public GitHub repo, not an anonymous review link (E4GEN's `anonymous.4open.science` one in the paper has expired).
- New custom bib fields must go in `filtered_bibtex_keywords` or they show in the BibTeX popup.

### Thumbnails

`preview = {<name>.png}` → `assets/img/publication_preview/`. Those shared with Dahai Yu's site came from it; UrbanHuRo, GeoGen, HCRide, FairCod and FairMove were cropped the same way (FairMove has no figure titled framework: it uses Fig. 7, the per-slot displacement pipeline; the ICASSP paper has no figure at all, so it shows Table 2's body, cropped between its top and bottom rules). The WASA paper has none, by choice. Paper PDFs used for cropping go in `paper/` (excluded from the build and git; some are paywalled). 800px wide, landscape, cropped to the figure's bounding box without caption. Source is the paper's framework figure from the camera-ready PDF (arXiv where ACM DL 403s). To redo one: crop the union of image/drawing rects above the caption, with the bottom at `caption.y0 - 2`. `bib.liquid` uses the file name as `alt`, so name files by project.

### CV PDF

There is none yet. To add one, put it in `assets/pdf/` and set `cv_pdf:` in `_data/socials.yml` (a navbar icon; `check.py` checks the file exists). `_pages/cv.md` does not read `cv_pdf` — that was the removed plugin's layout; link the PDF from the page body if wanted there too.

## Findability

`description` leads with the full name (it is the search snippet); `tagline` is appended to the home `<title>`; `person:` feeds the `ProfilePage` JSON-LD. The rest is off-site: the homepage URL on Scholar, GitHub, LinkedIn, the FSU people page and the lab page, and `/sitemap.xml` submitted in Search Console.

## Checks

`python3 tools/check.py` (needs PyYAML; skips YAML parsing without it) checks conventions that live in two places at once: plugin lists, `abbr` vs `venues.yml`, `preview` files and their size/aspect, custom bib fields vs `filtered_bibtex_keywords`, `about.md` anchors and the `selected_papers.liquid` nocite list vs citekeys, the email and `cv_pdf` across files, `nav_order` collisions, `_news` filename vs date, one line per bib field, `tools/` in `exclude:`, font sizes below 1rem in our CSS (`FONT_FLOOR_EXCEPTIONS` is the escape hatch), the Ruby pin shared by both workflows, and the local overrides' `Local change:` markers.

**When you add a convention that must hold in two files, add a check for it.** Errors render wrong or fail; warnings will rot. CI (`ci.yml`) runs `--strict`; the deploy doesn't, so a warning never blocks publishing.

## Deploying

- Repo must be public, named `linjiang18.github.io` (`baseurl` empty), with Pages source = **GitHub Actions**. GitHub's own builder can't build this site (non-whitelisted gems); if the source reverts to a branch, fix the setting — **not** with `.nojekyll`, which would publish raw source.
- Both workflows pin Ruby `4.0` (older RubyGems can't parse the libc-qualified `PLATFORMS` in `Gemfile.lock`) and install ImageMagick for responsive images. `check.py` asserts the pins match.
