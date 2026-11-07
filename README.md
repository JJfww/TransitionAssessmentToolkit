# Transition Assessment Toolkit

This repository is the source of truth for the live Hugo site. Make website updates here; the legacy `TAssess` repository is used only for redirect maintenance.

Local preview:

```bash
hugo server --source /Users/jennifer/Desktop/TAssess-hugo --renderToMemory --disableFastRender --port 3001 --bind 127.0.0.1
```

Build:

```bash
hugo --source /Users/jennifer/Desktop/TAssess-hugo
```

Files:

- `content/`: homepage, About, assessment domains, collections, and support paths
- `data/resources.json`: resource titles, descriptions, groups, tags, and links
- `static/files/`: PDFs served directly by the site
- `layouts/`: templates and shared resource-card, link, and filter partials
- `assets/`: site styles and client-side search/filter behavior
- `public/`: generated Hugo output; do not hand-edit

## Updating resources

Add local PDFs to `static/files/` and create or update the corresponding record in `data/resources.json`. Use a bundle when one resource needs several links. PDF sizes are read from local files during the build. Keep language and fillable-form claims in descriptions or link labels only when verified.

Support tags drive cross-domain pages as well as filters. Keep a resource's tags consistent with its group. Filters only appear when they can narrow the current collection; multiple selections within one filter category match any selection, and tag and format categories are combined.

Some PDFs are not directly referenced in the resource dataset. Preserve them until their provenance and any links from other documents have been checked; an unreferenced file is not automatically safe to delete or appropriate to list.

## Validation and deployment

Run the Hugo build, inspect affected pages using the local HTTP preview, and check changed links and filters. Homepage searches match all entered words in any order and store the query in the URL.

Pushing `main` triggers `.github/workflows/deploy.yml`, which builds with `hugo --minify` and the GitHub Pages base URL. Building locally does not publish the site.
