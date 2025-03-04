# DIRECTUXT

## *Directus + Nuxt boilerplate*

Everything is dockerized, using Typescript and structured as monorepo with pnpm.

To use it you'll need globally installed [pnpm](https://github.com/pnpm/pnpm) and [nvm](https://github.com/nvm-sh/nvm), upload to production is meant to work with [Coolify](https://github.com/coollabsio/coolify).

Happy coding !

## Scripts

A few utils scripts are included, they all can be run from root via pnpm.

- `dev`: install dependencies and mount docker volumes
- `prod`: preview production apps, docker will use .env.prod file
- `backup`: backup postgres database and directus uploads folder
- `restore`: restore postgres and directus uploads from local availables backups
- `export-template`: export local directus app as a template
- `apply-template`: apply template to local directus app
- `update-template`: export production template to locale folder
- `types`: update Nuxt types from Directus schema
- `test`: run Nuxt tests with vitest
- `lint`: run eslint and prettier check
- `lintfix`: auto fix for linter and formater errors

And backup, restore and template scripts made to be run from within directus container.

## Setup for dev & prod

First of all create `.env` and `.env.prod` files based on `.env.example`.

### NUXT

For dev set up the only needed step is to run `pnpm dev`from root folder.

### DIRECTUS

At project init for dev you'll need to run from root folder :

```bash
# Install dependencies and run apps
pnpm dev

# In Directus create an admin token
# Directus --> User Directory --> Admin User --> Generate Token --> Copy Token --> Save User

# Apply base theme template
pnpm apply-template
```

Another usefull command to export/import just the data schema :

```bash
# Export
npx directus schema snapshot --yes ./snapshot.yaml

# Import
npx directus schema apply --yes ./path/to/snapshot.yaml
```

### COOLIFY

TODO : Improve

- Create new project, add a ressource with Github app (private repo), load repo and choose Docker Compose as Build Pack.
- Choose right docker-compose file : _/compose.prod.yml_
- Set domains (make sure to replace it in the app too) and matching environment variables, sync your locale env.prod and coolify project env variables.
- Bind volumes as directories in Storages, set _directus/backup.sh_ as a file and copy it's content to Coolify.

TODO : instructions with db transfer scripts

- In Directus app create token _User Directory --> Admin User --> Generate Token --> Copy Token --> Save User_ and add it to env variables.
- Apply template (from local) with : `npx directus-template-cli@latest apply`. You'll need to provide local path to template, production Directus link and admin token.

Finally :

- Add _directus/template.sh_ as cronjob, from project configurations in Coolify : _Scheduled Task --> + Add --> 'sh /directus/template.sh' as Command --> 'directus' as Container name_.
- Good to go!

<p float="middle">
    <img
        src="https://img.shields.io/badge/nuxt%20js-00C58E?style=for-the-badge&logo=nuxtdotjs&logoColor=white"
        alt="nuxt"
    />
    <img
        src="https://img.shields.io/badge/directus-%2364f.svg?style=for-the-badge&logo=directus&logoColor=white"
        alt="directus"
    />
    <img
        src="https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220"
        alt="pnpm"
    />
    <img
        src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"
        alt="docker"
    />
    <img
        src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"
        alt="typescript"
    />
    <img
        src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"
        alt="postgres"
    />
    <img
        src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white"
        alt="eslint"
    />
    <img
        src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"
        alt="tailwind"
    />
    <img
        src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E"
        alt="vite"
    />
    <img
        src="https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white"
        alt="sass"
    />
</p>
