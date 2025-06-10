# Fox Voting System - ITK2004 Eksamen

En komplett stemmeapplikasjon for rev-bilder bygget med Node.js, Express, MongoDB og EJS templates.

## 📋 Eksameninformasjon

- **Fagkode:** ITK2004
- **Fagnavn:** TVERRFAGLIG EKSAMEN
- **Utdanningsprogram:** Informasjonsteknologi Vg2
- **Dato:** 10. juni – 11. juni 2025

## 🦊 Systemoversikt

Fox Voting System lar brukere stemme på tilfeldige rev-bilder hentet fra randomfox.ca API. Systemet viser sanntidsstatistikk over hvilke rever som er mest populære.

### 🏗️ Arkitektur

Systemet består av tre separate tjenester:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│  10.12.91.103   │────│  10.12.91.101   │────│  10.12.91.102   │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 27017   │
│                 │    │                 │    │                 │
│ • EJS Templates │    │ • REST API      │    │ • MongoDB       │
│ • Bootstrap UI  │    │ • Express.js    │    │ • Vote Storage  │
│ • Responsive    │    │ • Mongoose ODM  │    │ • Aggregation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Funksjoner

### Brukerfunksjoner
- 🖼️ Visning av to tilfeldige rev-bilder side ved side
- 🗳️ Enkel stemmegivning med ett klikk
- 📊 Sanntidsstatistikk og rankinglister
- 🏆 Visning av mest populære rev
- 📱 Fullt responsiv design for alle enheter
- ♿ Universell utforming og tilgjengelighet

### Tekniske funksjoner
- 🔒 Rate limiting og spambeskyttelse
- 🔄 Automatisk oppdatering av statistikk
- 🛡️ Sikkerhetstiltak og input-validering
- 📋 Komplett API-dokumentasjon
- 🚀 Skalerbar mikroservice-arkitektur
- 📝 Omfattende logging og feilhåndtering

## 🚀 Installasjon og oppsett

### Forutsetninger
- Node.js (v16 eller nyere)
- MongoDB (v5 eller nyere)
- NPM eller Yarn

### 1. Klone repository
```bash
git clone <repository-url>
cd eksamen2025
```

### 2. Installer avhengigheter
```bash
# Installer hovedavhengigheter
npm install

# Installer backend-avhengigheter
cd backend && npm install && cd ..

# Installer frontend-avhengigheter  
cd frontend && npm install && cd ..
```

### 3. Konfigurer servere

#### MongoDB Server (10.12.91.102)
```bash
# Start MongoDB og bind kun til intern IP
mongod --bind_ip 10.12.91.102 --port 27017
```

#### Backend Server (10.12.91.101)
```bash
cd backend
npm start
```

#### Frontend Server (10.12.91.103)
```bash
cd frontend
npm start
```

## 🔧 Konfigurering

### Backend konfigurering
Rediger `backend/config.js`:
```javascript
const config = {
  port: 3001,
  host: '10.12.91.101',
  mongodb: {
    uri: 'mongodb://10.12.91.102:27017/foxvoting'
  },
  cors: {
    origin: 'http://10.12.91.103:3000'
  }
};
```

### Frontend konfigurering
Rediger `frontend/config.js`:
```javascript
const config = {
  port: 3000,
  host: '10.12.91.103',
  api: {
    baseUrl: 'http://10.12.91.101:3001'
  }
};
```

## 📚 API Dokumentasjon

### Endepunkter

| Metode | URL | Beskrivelse |
|--------|-----|-------------|
| GET | `/api/foxes?count=2` | Hent tilfeldige rev-bilder |
| POST | `/api/vote` | Avgå stemme for en rev |
| GET | `/api/statistics` | Hent komplett stemmestatistikk |
| GET | `/api/health` | Systemhelse og status |
| GET | `/api/fox/:foxId/votes` | Hent stemmer for spesifikk rev |

### Eksempel API-kall

#### Hente rever
```bash
curl http://10.12.91.101:3001/api/foxes?count=2
```

#### Stemme på rev
```bash
curl -X POST http://10.12.91.101:3001/api/vote \
  -H "Content-Type: application/json" \
  -d '{"foxId": "fox123", "imageUrl": "https://randomfox.ca/images/123.jpg"}'
```

## 🔒 Sikkerhet

### Implementerte tiltak
- ✅ Rate limiting (100 requests per 15 minutter)
- ✅ CORS konfigurert for korrekte domener
- ✅ Input-validering og sanitering
- ✅ Helmet.js for HTTP-sikkerhet
- ✅ Spambeskyttelse mot gjentatte stemmer
- ✅ MongoDB kun tilgjengelig på intern IP

### Identifiserte sikkerhetshull
- ⚠️ IP-spoofing kan omgå spambeskyttelse
- ⚠️ Ingen autentisering av brukere
- ⚠️ MongoDB direktetilgang fra interne IP-er

### Potensielle angrepstyper
- 🔴 DDoS-angrep mot API-endepunkter
- 🔴 NoSQL injection mot database
- 🔴 Session hijacking (ingen sessions implementert)

## 📁 Prosjektstruktur

```
eksamen2025/
├── backend/                 # Backend API server
│   ├── models/             # MongoDB modeller
│   ├── routes/             # API ruter
│   ├── services/           # Forretningslogikk
│   ├── config.js           # Konfigurering
│   ├── server.js           # Hovedserver
│   └── package.json
├── frontend/               # Frontend webserver
│   ├── views/              # EJS templates
│   ├── public/             # Statiske filer
│   │   ├── css/           # CSS stilark
│   │   └── js/            # JavaScript filer
│   ├── config.js           # Konfigurering
│   ├── server.js           # Hovedserver
│   └── package.json
├── package.json            # Hovedprosjekt
└── README.md              # Denne filen
```

## 🧪 Testing

### Manuell testing
1. Gå til `http://10.12.91.103:3000`
2. Stem på forskjellige rever
3. Sjekk at statistikk oppdateres
4. Test responsivt design på mobil
5. Verifiser feilhåndtering

### API testing
```bash
# Test API helse
curl http://10.12.91.101:3001/api/health

# Test rate limiting
for i in {1..110}; do curl http://10.12.91.101:3001/api/foxes; done
```

## 🚨 Feilsøking

### Vanlige problemer

#### Bildene laster ikke
- Sjekk internettforbindelse
- Verifiser at randomfox.ca API er tilgjengelig
- Oppdater siden (F5)

#### Kan ikke stemme
- Vent 1 minutt før du stemmer på samme rev igjen
- Sjekk at backend-serveren kjører
- Kontroller nettverksforbindelse

#### Statistikk vises ikke
- Sjekk at MongoDB kjører på 10.12.91.102
- Verifiser backend API-tilkobling
- Stem på noen rever for å generere data

### Log-filer
- Backend logger: Console output på 10.12.91.101
- Frontend logger: Console output på 10.12.91.103
- MongoDB logger: Standard MongoDB log location

## 📊 Oppfylte eksamenskrav

### ✅ Del 1: Hente og vise bilder
- [x] Bruk av randomfox.ca API
- [x] Side-ved-side visning av bilder
- [x] Tydelige stemmeknapper under hvert bilde
- [x] Stemmeregistrering og tilbakemelding til bruker

### ✅ Del 2: Vise statistikk
- [x] Visning av mest populære rev med bilde
- [x] Toppliste over populære rever i småbildeformat
- [x] Melding om hvilken rev som leder
- [x] Automatisk oppdatering av statistikk

### ✅ Del 3: Driftsstøtte
- [x] Applikasjon og database på separate virtuelle maskiner
- [x] MongoDB kun lytter på backend's interne IP-adresse
- [x] Frontend, backend og database som separate tjenester
- [x] Blokkert direktetilgang til database fra internett
- [x] API-endepunkter dokumentert
- [x] Prosjektskisse med kobling mellom komponenter
- [x] Oversikt over database-tabeller og IP-plan
- [x] Identifisert minst tre potensielle sikkerhetshull
- [x] Navngitt minst to angrepstyper
- [x] Beskrevet tiltak for 3 reduserte risikoer
- [x] Demonstrerbar løsning i testmiljø

### ✅ Del 4: Brukerstøtte
- [x] Intuitiv og enkel brukeropplevelse
- [x] Tydelig hvordan man stemmer på bilder
- [x] Klar tilbakemelding etter stemmegivning
- [x] Forståelige feilmeldinger ved problemer
- [x] Prinsipper for universell utforming
- [x] Fungerer på både desktop og mobil
- [x] Brukerveiledning som forklarer systembruk
- [x] Dokumentasjon med oversikt over vanlige feil
- [x] Godt kommentert kode

## 👥 Kontakt

Dette er et eksamenssystem for ITK2004. For teknisk support eller spørsmål om implementeringen, kontakt systemadministrator.

## 📄 Lisens

Dette prosjektet er laget for eksamen ITK2004 og er ment for utdanningsformål.