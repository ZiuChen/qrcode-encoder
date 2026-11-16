# qrcode-encoder

Zero-dependency QR Code encoder library, plus an online QR tool with history — managed as a pnpm monorepo.

## Structure

```
apps/
  website/            # Vue 3 + vue-router + shadcn-vue site
    ├── /              # Library demo (playground, features, quick start)
    └── /tool          # QR tool with IndexedDB history & clipboard copy
packages/
  qrcode-encoder/     # The npm library (encoder + SVG/Canvas/PNG/Terminal renderers)
```

## Development

```bash
pnpm install
pnpm dev            # dev server for apps/website
pnpm build          # build library, then website
pnpm test           # library unit tests
```

> Building `apps/website` requires `packages/qrcode-encoder/dist` to exist first — `pnpm build` handles the ordering.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow that builds `apps/website` and deploys it to GitHub Pages:

- Site: https://ziuchen.github.io/qrcode-encoder/
- Tool: https://ziuchen.github.io/qrcode-encoder/tool

The tool keeps history in the browser's IndexedDB (up to 500 records, deduplicated by content + options). Each record stores the rendered content, parameters (ECC level, module size, quiet zone) and timestamps; clicking a record restores everything for quick backtracking.

## Library

See [packages/qrcode-encoder](./packages/qrcode-encoder) for API docs, or the [npm package](https://www.npmjs.com/package/qrcode-encoder).
