# Tramona

We're using the [T3 stack](https://create.t3.gg/) with Drizzle, SST, and shadcn/ui:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [shadcn/ui](https://ui.shadcn.com)

## Development setup

1. `npm install -g pnpm` if you don't have pnpm ("performant npm") already. Use it like npm, just with a p in front (and do `pnpm ...` insetad of `npx ...`)
2. `pnpm install`
3. `pnpm run dev`
4. copy paste env vars from `#env` in slack into a local `.env` file

## Using Shadcn

The idea behind shadcn is that you copy paste their components as a starting point, then customize them to your needs. All the components copy-pasted from shadcn are in the [components/ui](/src/components/ui/) folder. To get started:

1. Read the [introduction page](https://ui.shadcn.com/docs) and the [theming page](https://ui.shadcn.com/docs/theming). Then look at our [globals.css](/src/styles/globals.css) file. Use these semantic colors whenever possible.
2. Skim throught the shadcn/ui docs to see all of the components shadcn offers, and use them as much as possible too.
3. Use either our code or the examples in the shadcn docs as reference.

## Other

Check out (and add to as needed) our [utility functions](/src/utils/utils.ts) and [utility comopnents](/src/components/utils/).
