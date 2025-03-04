# Nuxt

## Setup / Dev server

Make sure to have a valid `.env` file in root, see `.env.example` for structure.

Then, from root run :

```bash
pnpm dev
```

## Nuxi

To add new component/page/composable etc with :

```bash
npx nuxi add <TEMPLATE> <NAME> [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--force]
```

For example :

```bash
nuxi add component MyComponent
```

See all nuxi commands availables at the [nuxi documentation](https://nuxt.com/docs/api/commands/add) to learn more.

## Radix Vue

This app uses Radix Vue component library, see [dedicated documentation](https://www.radix-vue.com/overview/introduction.html).

A lot of good other components can be found in [ui thing](https://ui-thing.behonbaker.com/getting-started/introduction) project.

## VueUse

A lot of usefull composables/helper functions can be used from [VueUse](https://vueuse.org/).

## Taze

Thanks to our dear Antony Fu you can update your npm packages with [Taze](https://github.com/antfu-collective/taze/tree/main)

```bash
npx taze -w
```

## Nuxt Documentation

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
