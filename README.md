# Ritningsmätning

Webbaserat verktyg för att mäta på PDF‑ritningar. Detta är grunden för MVP:n med Next.js 14, Tailwind och Supabase.

## Kom igång

1. Installera beroenden
   ```bash
   npm install
   ```
2. Kopiera `.env.example` till `.env` och fyll i `NEXT_PUBLIC_SUPABASE_URL` och `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Skapa databastabeller i Supabase genom att köra `supabase db push < supabase/schema.sql` eller kör SQL‑filen manuellt.
4. Starta utvecklingsservern
   ```bash
   npm run dev
   ```

## Sidor

- `/login` – inloggning via magic link.
- `/projects` – lista och skapa projekt.
- `/projects/[id]` – detaljer (placeholder).
- `/viewer/[sheetId]` – PDF‑viewer (placeholder).

Fortsatta steg inkluderar kalibrering, mätverktyg och export.
