# TAssess Hugo Prototype

This is a parallel Hugo-based rebuild of the current transition assessment site.

Goals:

- Keep the current mdBook site live while the new build is developed
- Use a simpler content model based on `data/resources.json`
- Organize resources by domain and group
- Make future updates closer to "add a file, add one data entry, rebuild"

Current sample migration:

- Education
- Self-Determination
- Vocational/Employment

Local preview:

```bash
hugo server
```

Build:

```bash
hugo
```

Files:

- `content/domains/`: domain pages and descriptions
- `data/resources.json`: sample resource dataset
- `static/files/`: copied PDFs used by the sample prototype
- `layouts/`: Hugo templates
