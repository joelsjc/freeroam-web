# Freeroam Radar — Creator Panel

Starter do painel web (Next.js + TypeScript) que consome a API do NewsModule
do Freeroam. Login, feed com filtro por categoria/confiança/busca, e detalhe
do evento.

## Rodar local

```bash
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_API_URL se precisar
npm run dev
```

Abre em http://localhost:3000.

## Deploy no VPS (ao lado do backend em /opt/freeroam)

```bash
cd /opt/freeroam/apps/web
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1" > .env.local
npm run build
pm2 start npm --name freeroam-web -- start
pm2 save
```

O `npm start` sobe em `http://localhost:3020` (porta definida em
`package.json`, para não colidir com a API na 3010 nem com o ViralForge nas
3000/3001).

Se quiser expor publicamente, aponte um domínio/subdomínio pra porta 3020
via Nginx (reverse proxy) — não incluído aqui de propósito, pra não mexer na
configuração de rede do VPS sem sua aprovação.

## O que falta (próxima fase)

- O endpoint `/news/:id` (detalhe) precisa existir na API tal como está —
  hoje só confirmamos `/news` (lista). Testar e ajustar `lib/api.ts` se a
  rota real for diferente.
- Paginação/scroll infinito no feed (a API real de `/news` pode já paginar —
  ver findings de auditoria pendentes).
- Layout ainda não tem versão para telas grandes otimizada (hoje é mobile-first
  mas funcional em desktop).
