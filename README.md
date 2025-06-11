# Fox Voting System

Et avstemningssystem for å velge den søteste reven, bygget for praktisk eksamen i Informasjonsteknologi Vg2.

### Servere
- **Frontend Server**: 10.12.91.103
- **Backend Server**: 10.12.91.101
- **Database Server**: 10.12.91.102

### Programvare
- Node.js 18.x eller nyere
- MongoDB 6.0 eller nyere
- PM2 (for produksjon)
- Nginx (valgfritt, for reverse proxy)

## Fox Voting System - Prosjektstruktur

```
fox-voting-system/
├── README.md                    # Hovedinstruksjoner og oversikt
├── package.json                 # Node.js avhengigheter og scripts
├── .env                         # Miljøvariabler for konfigurasjon
│
├── backend/                     # Backend API server (modular arkitektur)
│   ├── server.js               # Hovedserver fil og middleware setup
│   ├── config/                 # Konfigurasjonsfiler
│   │   ├── database.js         # MongoDB tilkoblingskonfigurasjon
│   │   └── cors.js             # CORS policy konfigurasjon
│   ├── controllers/            # Business logic controllers
│   │   ├── foxController.js    # Fox-relaterte funksjoner
│   │   ├── voteController.js   # Stemme-relaterte funksjoner
│   │   └── statisticsController.js # Statistikk-relaterte funksjoner
│   ├── routes/                 # API route definitioner
│   │   ├── foxRoutes.js        # /api/foxes/* endpoints
│   │   ├── voteRoutes.js       # /api/vote/* endpoints
│   │   ├── statisticsRoutes.js # /api/statistics/* endpoints
│   │   └── utilityRoutes.js    # /api/health, /api/docs endpoints
│   ├── middleware/             # Custom middleware
│   │   ├── errorHandler.js     # Sentralisert feilhåndtering
│   │   └── logger.js           # Request logging middleware
│   └── models/                 # MongoDB modeller
│       ├── Fox.js              # Fox datamodell
│       └── Vote.js             # Vote datamodell
│
├── frontend/                    # Frontend webserver
│   ├── server.js               # Express server for EJS
│   ├── views/                  # EJS templates
│   │   ├── layout.ejs          # Hoved-layout
│   │   ├── index.ejs           # Avstemningsside
│   │   ├── statistics.ejs      # Statistikkside
│   │   ├── guide.ejs           # Brukerveiledning
│   │   └── error.ejs           # Feilside
│   └── public/                 # Statiske filer
│       ├── css/
│       │   └── style.css       # Custom CSS
│       ├── js/
│       │   └── main.js         # Frontend JavaScript
│       └── images/             # Statiske bilder
│
├── scripts/                     # Hjelpescripts
│   └── seed-data.js            # Database seeding script
```

### Konfigurasjon
- **.env**: Miljøvariabler for porter, hosts og databasekonfigurasjon

### Backend-filer (Modular arkitektur)
- **server.js**: Hovedserver fil med middleware setup og route mounting
- **config/database.js**: MongoDB tilkoblingskonfigurasjon med miljøvariabler
- **config/cors.js**: CORS policy konfigurasjon for cross-origin requests
- **controllers/**: Business logic separert fra routes
  - **foxController.js**: Henter og behandler revebilder fra API
  - **voteController.js**: Håndterer stemmelogikk og brukersporing
  - **statisticsController.js**: Beregner og returnerer avstemningsstatistikk
- **routes/**: API endpoint definitioner
  - **foxRoutes.js**: `/api/foxes/*` routes
  - **voteRoutes.js**: `/api/vote/*` routes  
  - **statisticsRoutes.js**: `/api/statistics/*` routes
  - **utilityRoutes.js**: `/api/health`, `/api/docs` routes
- **middleware/**: Custom middleware funksjoner
  - **errorHandler.js**: Sentralisert feilhåndtering og logging
  - **logger.js**: Request/response logging middleware
- **models/**: MongoDB Mongoose modeller
  - **Fox.js**: Revebilder med URL, stemmetall og metadata
  - **Vote.js**: Individuelle stemmer med bruker-ID og tidsstempel

### Frontend-filer
- **server.js**: Express-server som serverer EJS-templates og proxy til backend
- **views/**: EJS templates med Bootstrap og responsivt design
- **public/css/style.css**: Custom CSS med dark mode og animasjoner
- **public/js/main.js**: Frontend JavaScript for AJAX og brukerinteraksjon

## Bruk

### For sluttbrukere

1. Åpne nettleseren og gå til foxvoting.wendigo.ikt-fag.no
2. Se to revebilder side om side
3. Klikk på "Stem på denne reven" under bildet du foretrekker
4. Se statistikk over mest populære rever

Se [Brukerveiledning](http://10.12.91.103/guide) for detaljerte instruksjoner.

### For utviklere

#### Start i utviklingsmodus

```bash
# Backend
npm run dev:backend

# Frontend (i ny terminal)
npm run dev:frontend
```

#### Start i produksjon

```bash
# Bruker PM2
pm2 start ecosystem.config.js
pm2 save
```

## 📚 API-dokumentasjon

### Endepunkter

| Metode | URL | Beskrivelse |
|--------|-----|-------------|
| GET | `/api/foxes/random` | Henter to tilfeldige revebilder |
| POST | `/api/vote` | Registrerer en stemme |
| GET | `/api/statistics` | Henter avstemningsstatistikk |
| GET | `/api/health` | Helsesjekk |
| GET | `/api/docs` | API-dokumentasjon |

### Eksempel: Registrer stemme

```bash
curl -X POST http://10.12.91.101:5000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://randomfox.ca/images/1.jpg"}'
```

## Sikkerhet

Systemet implementerer flere sikkerhetstiltak:

- MongoDB kun tilgjengelig internt
- Firewall-regler på alle servere
- CORS-konfigurasjon
- Input-validering
- Feilhåndtering som skjuler sensitive detaljer
- Cookie-basert autentisering

## Feilsøking

### Vanlige problemer

#### Frontend viser ikke bilder
```bash
# Sjekk backend status
pm2 status
pm2 logs fox-voting-backend

# Test backend API
curl http://10.12.91.101:5000/api/health
```

#### Kan ikke koble til database
```bash
# På database server
sudo systemctl status mongod

# Test tilkobling fra backend
mongo mongodb://10.12.91.102:27017/foxvoting
```

#### Nginx feil
```bash
# Test konfigurasjon
sudo nginx -t

# Se error log
sudo tail -f /var/log/nginx/error.log
```

### Logger

- PM2 logger: `pm2 logs`
- MongoDB logger: `/var/log/mongodb/mongod.log`
- Nginx logger: `/var/log/nginx/`
