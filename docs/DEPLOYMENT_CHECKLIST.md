# Deployment Sjekkliste

## Pre-deployment

- [ ] Alle servere har statiske IP-adresser
  - Frontend: 10.12.91.103
  - Backend: 10.12.91.101
  - Database: 10.12.91.102
- [ ] SSH-tilgang er konfigurert til alle servere
- [ ] Servere har tilstrekkelig diskplass og minne

## Database Server (10.12.91.102)

- [ ] MongoDB er installert
- [ ] MongoDB lytter kun på intern IP (10.12.91.102)
- [ ] Firewall tillater kun tilgang fra backend (10.12.91.101)
- [ ] MongoDB-tjenesten starter automatisk ved boot
- [ ] Test tilkobling: `mongo mongodb://10.12.91.102:27017/foxvoting`

## Backend Server (10.12.91.101)

- [ ] Node.js 18.x er installert
- [ ] PM2 er installert globalt
- [ ] Backend-kode er kopiert til `/opt/foxvoting`
- [ ] NPM-pakker er installert
- [ ] `.env` fil er konfigurert
- [ ] Firewall tillater kun tilgang fra frontend (10.12.91.103)
- [ ] PM2 starter automatisk ved boot
- [ ] Test API: `curl http://10.12.91.101:5000/api/health`

## Frontend Server (10.12.91.103)

- [ ] Node.js 18.x er installert
- [ ] PM2 er installert globalt
- [ ] Nginx er installert og konfigurert
- [ ] Frontend-kode er kopiert til `/opt/foxvoting`
- [ ] NPM-pakker er installert
- [ ] `.env` fil er konfigurert
- [ ] Firewall tillater HTTP (80) og HTTPS (443)
- [ ] PM2 starter automatisk ved boot
- [ ] Nginx starter automatisk ved boot
- [ ] Test frontend: Åpne http://10.12.91.103 i nettleser

## Funksjonalitetstest

### Grunnleggende funksjoner
- [ ] Forsiden laster og viser to revebilder
- [ ] Bilder laster fra randomfox.ca
- [ ] Avstemningsknapper er synlige og klikkbare
- [ ] Avstemning gir tilbakemelding til bruker
- [ ] Statistikksiden viser korrekt data
- [ ] Statistikk oppdateres automatisk

### Feilhåndtering
- [ ] Feilmeldinger vises ved nettverksproblemer
- [ ] System håndterer manglende bilder
- [ ] Brukervennlige feilmeldinger på norsk

### Sikkerhet
- [ ] MongoDB ikke tilgjengelig fra internett
- [ ] Backend API kun tilgjengelig fra frontend
- [ ] Ingen sensitive data eksponeres i feilmeldinger

## Ytelse og stabilitet

- [ ] Responstid under 2 sekunder for alle operasjoner
- [ ] System håndterer minst 100 samtidige brukere
- [ ] Automatisk restart ved krasj (PM2)
- [ ] Logger fungerer korrekt

## Dokumentasjon

- [ ] README.md er oppdatert
- [ ] API-dokumentasjon er tilgjengelig
- [ ] Brukerveiledning er tilgjengelig online
- [ ] Sikkerhetsdokumentasjon er fullstendig
- [ ] Deployment-scripts er testet

## Backup og gjenoppretting

- [ ] MongoDB backup-strategi er definert
- [ ] Kode er versjonskontrollert
- [ ] Gjenopprettingsprosedyre er dokumentert

## Overvåking

- [ ] PM2 monitoring er aktivert
- [ ] Diskplass overvåkes
- [ ] CPU og minne overvåkes
- [ ] Error-logger sjekkes regelmessig

## Sluttsjekk

- [ ] Alle eksamenskriterier er oppfylt
- [ ] System er klart for demonstrasjon
- [ ] Testmiljø fungerer stabilt
- [ ] Kildekode er kommentert 