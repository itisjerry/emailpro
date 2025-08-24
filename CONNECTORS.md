# EmailPro Connectors (OAuth + IMAP + SMTP)

This folder adds **stubs** for connecting to Gmail and Microsoft 365 via OAuth, plus generic IMAP/SMTP helpers.

## 1) Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- **Google**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Microsoft**: `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`
- **Optional SMTP**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## 2) NextAuth Routes

- Route: `/api/auth/[...nextauth]` (App Router)
- Providers: Google (Gmail scopes), Azure AD (Graph scopes)
- Tokens are stored in the session JWT (demo). For production, consider a DB adapter.

## 3) Sample API Routes

### Gmail (using googleapis)
- `GET /api/gmail/profile` → returns Gmail profile for signed-in user

### Microsoft Graph
- `GET /api/microsoft/profile` → returns `/me` from Graph for signed-in user

### Generic SMTP (Nodemailer)
- `POST /api/smtp/send` with JSON body `{ to, subject, text|html }` (uses env SMTP creds by default)

### Generic IMAP (ImapFlow)
- `POST /api/imap/preview` with `{ host, port, secure, user, pass, mailbox, limit }` to list recent messages

> Notes:
> - For **Gmail sending**, you can either use Nodemailer with XOAUTH2 or Gmail API `users.messages.send`.
> - For **Microsoft sending**, prefer Graph `sendMail` over SMTP AUTH.

## 4) OAuth App Setup

### Google Cloud Console
- Create OAuth client (Web), add Authorized redirect URI: `https://YOUR_DOMAIN/api/auth/callback/google`
- Scopes: Gmail Read/Modify/Send + OpenID

### Azure App Registration (Entra ID)
- Add Redirect URI: `https://YOUR_DOMAIN/api/auth/callback/azure-ad`
- Expose delegated permissions: `Mail.Read`, `Mail.Send` (Graph)
- Enable **Allow public client flows** if testing device auth (not required here)
- Grant admin consent if tenant policy requires

## 5) Using in the UI

- Add a "Connect Account" button that links to `/api/auth/signin` (NextAuth). Choose provider: Google or Azure AD.
- After sign-in, call the sample APIs to verify the connection.
- For providers without OAuth (custom mailboxes), prompt for IMAP/SMTP host/port/user/pass and call the IMAP/SMTP endpoints.

## 6) Production Considerations

- Store refresh tokens in a DB (NextAuth adapter) for long-term use.
- Implement token refresh logic (Google & Azure) in `jwt` callback.
- Background jobs for sync (cron) and rate limiting per provider.
- Deliverability: configure SPF/DKIM/DMARC for your sending domains.
