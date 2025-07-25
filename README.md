# Deployment on Vercel

## Environment Variables

Set the following environment variables in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=###
NEXT_PUBLIC_SUPABASE_ANON_KEY=###
```

If you use a database (e.g., PostgreSQL via Prisma), also set:

```
DB_URL=your_supabase_database_url
```

## Steps

1. Push your code to GitHub/GitLab/Bitbucket.
2. Import your repo into Vercel.
3. Set the environment variables above in the Vercel dashboard (Project Settings > Environment Variables).
4. Deploy!

## Notes

- Do **not** commit `.env` files to your repo. Vercel will use the dashboard values.
- Your app will read these variables at build and runtime.
