# Lin Jiang — Personal Homepage

<https://linjiang18.github.io>

Academic homepage on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme. The repo holds only content, two workflows, and eleven small files that override or prune the theme; layouts, styles and Liquid tags come from the `al_folio_*` gems in the `Gemfile`. `CLAUDE.md` explains each local file.

**There is no local build.** Edit, push to `main`, and GitHub Actions builds and publishes the site. Pushing to any other branch, or opening a PR, runs the same build without deploying, so a mistake shows up as a red check instead of a broken site.

Before pushing, run the content checks (a few seconds, no Ruby needed):

```bash
python3 -m pip install --user pyyaml   # once
python3 tools/check.py
```

They catch what a build would not: a plugin in `_config.yml` but not the `Gemfile`, a `preview` pointing at a missing image, a `/publications/#key` link in `about.md` that names no entry, the email drifting between files, and so on.

## What to edit

| I want to… | Edit |
| --- | --- |
| Change the bio / photo / blurbs | `_pages/about.md` |
| Add a paper | `_bibliography/papers.bib` |
| Change the home page's selected papers | the `nocite` list in `_includes/selected_papers.liquid` (its order is the display order) |
| Add a paper thumbnail | `assets/img/publication_preview/<name>.png` (800 px wide, landscape) + `preview = {<name>.png}` |
| Post news | new file `_news/YYYY-MM-DD-slug.md` |
| Update the Experience (CV) page | `_data/cv.yml` |
| Edit talks, academic service, friends | `_pages/activities.html` |
| Add/remove a social link | `_data/socials.yml` |
| Link a coauthor's homepage (none are linked now) | `_data/coauthors.yml` |
| Recolor a venue badge, or set its CCF / CORE rank | `_data/venues.yml` |
| Site title, SEO, feature flags | `_config.yml` |
| Colours, font sizes, CSS tweaks | `_sass/_local.scss` |

The navbar comes from `nav:` / `nav_order:` in `_pages/`: Publications (1), News (2), Experience (3), Activities (4). `about.md` is the site root (`permalink: /`).

`plugins:` in `_config.yml` and the `Gemfile` must name the same plugins — one listed in only one of them silently does nothing. Both are cut down to what the site renders, so read `CLAUDE.md` before touching either.

## Deploying

One-time repo settings, both required:

- The repo is **public** and named `linjiang18.github.io` (a user site, so `baseurl` stays empty).
- Settings → Pages → Source: **GitHub Actions**. On "Deploy from a branch", GitHub also runs its own builder, which cannot build this site (it does not allow `jekyll-scholar` or the `al_folio_*` gems) and fails on every push.

`.github/workflows/deploy.yml` then builds every push to `main` and publishes `_site/`. For a custom domain later: add a `CNAME` file, change `url:`, point DNS at GitHub Pages.

Theme and action updates arrive as monthly Dependabot PRs (`.github/dependabot.yml`); the `al_folio_*` gems are pinned to exact versions, so nothing else would announce a new release. Merge once the PR's build is green.

## Keeping content honest

- Publication metadata: only claim pages, volumes and author lists you can source. When a preprint is published, edit its entry (add `doi`, keep `arxiv`; no `html` — it would duplicate the DOI button) — never add a second entry.
- News dates follow the acceptance announcement or the proceedings date.

The layout was adapted from [Dahai Yu's homepage](https://ufodestiny.github.io) (same al-folio v1 setup).
