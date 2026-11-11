# PayPulse Frontend (Angular 17 + Signals + Tailwind)

Painel de transações que consome o backend Java/Spring Boot em `/api/v1/transactions`.

## Rodar
```bash
npm install
npm start          # http://localhost:4200 (proxy /api -> http://localhost:8082)
npm run build      # gera dist/paypulse-frontend
npm test
```

## Backend
- `GET  /api/v1/transactions` → `Transaction[]`
- `POST /api/v1/transactions` body `{ "accountId": "ACC-123", "amount": 150.00 }` → `Transaction`

Habilite CORS no Spring Boot para `http://localhost:4200` caso não use o proxy (ex.: `@CrossOrigin` ou `WebMvcConfigurer`).
Em produção ajuste `src/environments/environment.ts` (`apiUrl`).

## Estrutura
```
src/app/
├── core/
│   ├── interceptors/http-error.interceptor.ts
│   ├── models/transaction.model.ts
│   └── services/transaction-api.service.ts
└── features/transactions/
    ├── components/transaction-form/
    └── pages/dashboard/
```
