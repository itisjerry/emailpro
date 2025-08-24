# EmailPro SaaS — Real-Time MVP (Next.js + NextAuth + Prisma + Graph/Gmail)

This build includes:
- Email/password **signup**, **email verification**, and **login** (NextAuth Credentials).
- OAuth linking for **Google (Gmail)** and **Microsoft 365 (Graph)**.
- Database persistence via **Prisma + PostgreSQL** (use Neon or Vercel Postgres).
- Sample APIs for Gmail/Graph profile, SMTP send, IMAP preview, and more.

## One-time setup

1. **Create a Postgres DB** (free): use [Neon](https://neon.tech/) → copy the `postgresql://...` connection string.
2. **Create SMTP creds** you control (e.g., your domain's SMTP or a provider) to send verification emails.
3. **Create OAuth apps** (free):
   - **Google Cloud Console**: OAuth client (Web). Redirect URI:
     `https://YOUR_DOMAIN/api/auth/callback/google`
   - **Azure App Registration**: Redirect URI:
     `https://YOUR_DOMAIN/api/auth/callback/azure-ad`
   - Scopes in `.env.example` comments.

## Local dev

```bash
cp .env.example .env.local
# Fill in:
# DATABASE_URL=postgresql://...
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=some-long-random-string
# SMTP_* and OAuth vars
npm install
npx prisma db push
npm run dev
```

Open http://localhost:3000

- Sign up → check your inbox → click verify → sign in.
- "Sign in with Google/Microsoft" links also work once OAuth is configured.

## Deploy to Vercel

- Create a new Vercel project from this repo/folder.
- In **Project → Settings → Environment Variables**, add everything from `.env.example` (real values).
- Run:
  ```bash
  vercel
  vercel --prod
  ```

## Notes

- This is a production-leaning MVP. Sending limits apply to Gmail/M365. For large campaigns, add a queue (e.g., Upstash Redis) and a cron/worker.
- Open/click tracking endpoints are included (see `/api/t/*`).

See `CONNECTORS.md` for connector details.
