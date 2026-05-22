.
├── CHANGELOG.md
├── README.md
├── WARP.md
├── app
│   └── api
│       └── cms
│           └── [...route]
├── package-lock.json
├── package.json
├── packages
│   ├── cli
│   │   ├── CHANGELOG.md
│   │   ├── README.md
│   │   ├── __tests__
│   │   │   └── index.test.ts
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── commands
│   │   │   │   ├── buy-credits.ts
│   │   │   │   ├── configure.ts
│   │   │   │   ├── dashboard.ts
│   │   │   │   └── login.ts
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   ├── providers
│   │   │   │   ├── base.ts
│   │   │   │   ├── commitgen.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── vercel-google.ts
│   │   │   ├── types.ts
│   │   │   └── utils
│   │   │       ├── commit-history.ts
│   │   │       ├── issue-tracker.ts
│   │   │       ├── loading.ts
│   │   │       └── multi-commit.ts
│   │   └── tsconfig.json
│   ├── shared
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── tsconfig.json
│   └── web
│       ├── README.md
│       ├── app
│       │   ├── admin
│       │   │   └── page.tsx
│       │   ├── api
│       │   │   ├── auth
│       │   │   │   ├── login
│       │   │   │   │   └── route.ts
│       │   │   │   ├── me
│       │   │   │   │   └── route.ts
│       │   │   │   └── verify
│       │   │   │       └── route.ts
│       │   │   ├── commit
│       │   │   │   └── generate
│       │   │   │       └── route.ts
│       │   │   ├── credits
│       │   │   │   └── packages
│       │   │   │       └── route.ts
│       │   │   ├── payment
│       │   │   │   ├── initialize
│       │   │   │   │   └── route.ts
│       │   │   │   └── status
│       │   │   │       └── route.ts
│       │   │   ├── settings
│       │   │   │   └── route.ts
│       │   │   ├── transactions
│       │   │   │   └── route.ts
│       │   │   ├── user
│       │   │   │   ├── commits
│       │   │   │   │   └── route.ts
│       │   │   │   ├── stats
│       │   │   │   │   └── route.ts
│       │   │   │   └── transactions
│       │   │   │       └── route.ts
│       │   │   └── webhooks
│       │   │       ├── 100pay
│       │   │       │   └── route.ts
│       │   │       └── paystack
│       │   │           └── route.ts
│       │   ├── callback
│       │   │   └── page.tsx
│       │   ├── credits
│       │   │   └── page.tsx
│       │   ├── dashboard
│       │   │   ├── _components
│       │   │   │   ├── CommitGenerator.tsx
│       │   │   │   ├── DashboardStats.tsx
│       │   │   │   ├── DashboardView.tsx
│       │   │   │   ├── LoginForm.tsx
│       │   │   │   ├── UsageHistory.tsx
│       │   │   │   └── VerifyForm.tsx
│       │   │   └── page.tsx
│       │   ├── docs
│       │   │   └── api-key
│       │   │       └── page.tsx
│       │   ├── favicon.ico
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── pricing
│       │   │   └── page.tsx
│       │   ├── privacy
│       │   │   └── page.tsx
│       │   └── terms
│       │       └── page.tsx
│       ├── components
│       │   ├── docs
│       │   │   └── api-key-guide.tsx
│       │   ├── header
│       │   │   └── HeaderUserMenu.tsx
│       │   ├── landing
│       │   │   └── terminal-demo.tsx
│       │   ├── transactions
│       │   │   ├── TransactionHistory.tsx
│       │   │   └── TransactionReceipt.tsx
│       │   └── ui
│       │       ├── aevr
│       │       │   ├── button.tsx
│       │       │   ├── card.tsx
│       │       │   ├── empty-state.tsx
│       │       │   ├── info-box.tsx
│       │       │   ├── loader.tsx
│       │       │   ├── responsive-dialog.tsx
│       │       │   └── summary-card.tsx
│       │       ├── button.tsx
│       │       ├── chart.tsx
│       │       ├── collapsible.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── error-boundary.tsx
│       │       ├── pagination.tsx
│       │       ├── scroll-area.tsx
│       │       └── table.tsx
│       ├── components.json
│       ├── eslint.config.mjs
│       ├── hooks
│       │   ├── aevr
│       │   │   ├── use-media-query.ts
│       │   │   ├── use-persisted-state.ts
│       │   │   ├── use-share.ts
│       │   │   └── use-status.ts
│       │   └── useCurrency.ts
│       ├── lib
│       │   ├── db.ts
│       │   ├── email.ts
│       │   ├── payment.ts
│       │   └── utils.ts
│       ├── models
│       │   ├── AuthToken.ts
│       │   ├── CreditUsage.ts
│       │   ├── PlatformSettings.ts
│       │   ├── Token.ts
│       │   ├── Transaction.ts
│       │   ├── User.ts
│       │   ├── Wallet.ts
│       │   ├── WalletTransaction.ts
│       │   └── WebhookEvent.ts
│       ├── next-env.d.ts
│       ├── next.config.ts
│       ├── package.json
│       ├── packages
│       │   └── web
│       │       └── app
│       │           └── dashboard
│       │               └── _components
│       ├── postcss.config.mjs
│       ├── public
│       │   ├── android-chrome-192x192.png
│       │   ├── android-chrome-512x512.png
│       │   ├── apple-touch-icon.png
│       │   ├── favicon-16x16.png
│       │   ├── favicon-32x32.png
│       │   ├── favicon.ico
│       │   ├── file.svg
│       │   ├── globe.svg
│       │   ├── next.svg
│       │   ├── vercel.svg
│       │   └── window.svg
│       ├── scripts
│       │   ├── migrate-balances.ts
│       │   └── set-admin.ts
│       ├── services
│       │   ├── walletService.ts
│       │   └── webhookEventLogger.ts
│       ├── store
│       │   └── useCurrencyStore.ts
│       ├── tsconfig.json
│       ├── tsconfig.tsbuildinfo
│       ├── types
│       │   └── zeptomail.d.ts
│       └── utils
│           ├── aevr
│           │   ├── date-formatter.ts
│           │   ├── http-client.ts
│           │   └── number-formatter.ts
│           ├── billing.ts
│           ├── credits
│           │   └── calculator.ts
│           ├── currency
│           │   └── currency.service.ts
│           ├── diff
│           │   └── processor.ts
│           ├── payWith100Pay.ts
│           ├── paystack
│           │   └── fees.ts
│           └── shared
│               └── httpClient.ts
├── tree.md
├── tsconfig.json
└── turbo.json

75 directories, 139 files
