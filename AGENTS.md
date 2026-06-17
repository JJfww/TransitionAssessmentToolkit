# Repository Guidelines

## Project Structure & Module Organization

This repository is the source of truth for the live Transition Assessment Toolkit Hugo site.

- `content/`: page content and section definitions such as `content/domains/` and `content/collections/`.
- `data/resources.json`: primary resource dataset used to render domain, collection, and tag pages.
- `layouts/`: Hugo templates for the homepage, domains, collections, and tag collections.
- `assets/`: site CSS and other processed assets.
- `static/files/`: PDFs and downloadable resources served directly by the site.
- `public/`: generated output from local Hugo builds; do not hand-edit.

## Build, Test, and Development Commands

- `hugo --source /Users/jennifer/Desktop/TAssess-hugo`: build the site locally and validate templates/data.
- `hugo server --source /Users/jennifer/Desktop/TAssess-hugo`: run a local preview server with live reload.
- `hugo server --source /Users/jennifer/Desktop/TAssess-hugo --renderToMemory --disableFastRender --port 3001 --bind 127.0.0.1`: run the preview in a way that matches local browser QA more reliably.
- `git -C /Users/jennifer/Desktop/TAssess-hugo status --short`: review pending changes before committing.
- `git -C /Users/jennifer/Desktop/TAssess-hugo push origin main`: publish by triggering the GitHub Pages workflow on `main`.

Example:

```bash
hugo --source /Users/jennifer/Desktop/TAssess-hugo
```

## Coding Style & Naming Conventions

- Use short front matter fields and concise, descriptive resource copy.
- Keep JSON formatting consistent with existing `data/resources.json` entries.
- Use kebab-case for content filenames such as `open-access-resources.md`.
- Prefer bundles in `resources.json` when one item needs multiple links.
- Add tags only when they support real filtering pages such as `spanish-assessments` or `high-support-needs`.

## Testing Guidelines

There is no formal test suite. Validate changes by:

- Running `hugo --source /Users/jennifer/Desktop/TAssess-hugo`
- Checking affected pages in `public/`
- Spot-checking new links, PDFs, and tag behavior after major content edits
- Using a local server preview rather than opening `public/*.html` directly via `file://`, since root-relative CSS and JS assets will not load correctly in that context

## Commit & Pull Request Guidelines

Recent commits use short, imperative messages such as `Alphabetize Kansas agencies` and `Add O*NET score entry link`. Follow that style:

- `Add supported decision-making resource`
- `Refine self-determination descriptions`

PRs should include a short summary, affected paths, screenshots for visible layout changes, and confirmation that the Hugo build succeeded.

## Agent Notes

- Make normal website updates here, not in the old `TAssess` repo.
- Use the legacy repo only for redirect maintenance.
- Production deploys happen through `.github/workflows/deploy.yml` on pushes to `main`; the workflow builds with `hugo --minify` and the GitHub Pages base URL.
