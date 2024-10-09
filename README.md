# only1test

Only1 Developer Test

## Tech Stack

- [Tanstack Start](https://tanstack.com/start/latest) full-stack React framework
- [Tanstack React Query](https://tanstack.com/query/latest) for data fetching and mutations
- [Vinxi](https://vinxi.dev/) build system, development
- [React](https://reactjs.org/) React 19 RC
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/) Headless UI and components for React
- [React Aria Tailwind Starter-kits](https://react-spectrum.adobe.com/react-aria/getting-started.html#starter-kits) tailwind styling components starter-kits for React Aria
- [Kysely](https://kysely.dev/) ORM
- [kysely-ctl](https://github.com/kysely-org/kysely-ctl) CLI tool for Kysely

## Getting Started

Install the dependencies:

```bash
npm install
```

### Database

- Create postgre database, set the `DATABASE_URL=` in `.env` file.
- Using kysely-ctl tool. Run `npx kysely -h` to show help.
- Run `npx kysely migrate list` to list all available database migrations.
- Run `npx kysely migrate up` to migrates the database.
- Run `npx kysely seed list` to list all available database seeds.
- Run `npx kysely seed run` to run all available database seeds.

### Run dev server

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
