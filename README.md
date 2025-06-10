# Image Voting System - Tverrfaglig Eksamen 2025

Et bilderanking-system utviklet som del av Tverrfaglig Eksamen 2025 for Informasjonsteknologi Vg2.

## 📋 Oversikt

Dette systemet lar brukere:
- Laste opp bilder
- Stemme på bilder (én stemme per bruker per bilde)
- Se statistikk over hvilke bilder som er mest populære

## 🏗️ Arkitektur

Systemet består av tre separate tjenester:

- **Frontend** (10.12.91.103:3000) - Express.js med EJS templates og Bootstrap
- **Backend** (10.12.91.101:5000) - Express.js REST API
- **Database** (10.12.91.102:27017) - MongoDB

## 🚀 Installasjon

### Forutsetninger

- Node.js 18+
- Docker og Docker Compose
- Git

### Oppsett med Docker (Anbefalt)

1. Klon repositoriet:
```bash
git clone [repository-url]
cd eksamen2025
```

2. Start alle tjenester:
```bash
docker-compose up -d
```

3. Åpne nettleseren på http://10.12.91.103:3000

### Manuelt oppsett

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### MongoDB

Installer MongoDB og konfigurer den til å lytte på 10.12.91.102:27017

## 🔒 Sikkerhet

- MongoDB er konfigurert til kun å akseptere tilkoblinger fra backend-serveren
- Direkte tilgang til databasen fra internett er blokkert
- Brukere kan kun stemme én gang per bilde (basert på IP/session)
- Filopplasting er begrenset til bildefiler under 5MB

## 📱 Universell utforming

Systemet følger prinsipper for universell utforming:
- Responsivt design som fungerer på mobil og desktop
- Støtte for skjermlesere
- Tastaturnavigasjon
- Høy kontrast-modus
- Redusert animasjon for brukere som foretrekker det

## 🛠️ Teknologier

- **Frontend**: Express.js, EJS, Bootstrap 5, Chart.js
- **Backend**: Express.js, Mongoose, Multer
- **Database**: MongoDB
- **Deployment**: Docker, Docker Compose

## 📁 Prosjektstruktur

```
eksamen2025/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── server.js
│   ├── views/
│   │   ├── index.ejs
│   │   ├── upload.ejs
│   │   ├── statistics.ejs
│   │   └── layout.ejs
│   ├── public/
│   │   ├── css/
│   │   └── js/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🧪 Testing

For å teste systemet:

1. Last opp flere bilder via "Last opp" siden
2. Stem på ulike bilder
3. Sjekk statistikk-siden for å se resultatene
4. Prøv å stemme på samme bilde igjen (skal få feilmelding)

## 🔧 Feilsøking

### MongoDB kobler ikke til
- Sjekk at MongoDB kjører på riktig IP-adresse
- Verifiser at backend har tilgang til MongoDB-porten

### Bilder vises ikke
- Sjekk at uploads-mappen eksisterer
- Verifiser at backend-serveren kjører

### Kan ikke stemme
- Sjekk nettverkstilkobling
- Se etter feilmeldinger i browser-konsollen

## 📝 Lisens

Dette prosjektet er utviklet som del av skoleeksamen.