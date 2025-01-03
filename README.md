# linear-changelog

## Setup

1. Install [Bun](https://bun.sh/)
2. Run `bun install`
3. Rename `.env.example` to `.env` and add your [Linear API key](https://linear.app/cobaia/settings/account/security)

## Get last week's completed issues

```bash
bun run index.ts
```

This will generate a `changelog-DATE.txt` file with the list.
