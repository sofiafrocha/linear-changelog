# 📝 Linear Changelog

## 🚚 Setup

1. Install [Bun](https://bun.sh/)
2. Run `bun install`
3. Rename `.env.example` to `.env` and add your [Linear API key](https://linear.app/cobaia/settings/account/security)

## 🚀 Get last week's completed issues

```bash
bun run index.ts
```

This will generate a `changelog-DATE.txt` file with the list of issues.

## 🗺️ Available options

- `--since`: to specify the date that issues will be filtered from `bun run index.ts --since 2025-01-01`
- `--project`: to specify the project that issues will be filtered from `bun run index.ts --project "Cool Project 1"`
- `--output`: to specify the name of the output file `bun run index.ts --output cool.txt`
