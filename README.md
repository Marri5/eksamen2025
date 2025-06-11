# Fox Voting System

Et avstemningssystem for å velge den søteste reven, bygget for praktisk eksamen i Informasjonsteknologi Vg2.

## 📋 Innholdsfortegnelse

- [Systemkrav](#systemkrav)
- [Arkitektur](#arkitektur)
- [Installasjon](#installasjon)
- [Deployment](#deployment)
- [Bruk](#bruk)
- [API-dokumentasjon](#api-dokumentasjon)
- [Sikkerhet](#sikkerhet)
- [Feilsøking](#feilsøking)

## 🖥️ Systemkrav

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
│
├── backend/                     # Backend API server
│   ├── server.js               # Express server og API-endepunkter
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
```
## Filbeskrivelser

### Backend-filer
- **server.js**: Hovedfil for backend API med Express-konfigurasjon og alle API-endepunkter
- **models/Fox.js**: Mongoose-modell for revebilder med URL og stemmetall
- **models/Vote.js**: Mongoose-modell for individuelle stemmer

### Frontend-filer
- **server.js**: Express-server som serverer EJS-templates
- **views/**: Alle EJS-templates for brukergrensesnittet
- **public/css/style.css**: Custom CSS for responsive design og animasjoner
- **public/js/main.js**: JavaScript for avstemningsfunksjonalitet og AJAX-kall

## 💻 Bruk

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

## 🔒 Sikkerhet

Systemet implementerer flere sikkerhetstiltak:

- MongoDB kun tilgjengelig internt
- Firewall-regler på alle servere
- CORS-konfigurasjon
- Input-validering
- Feilhåndtering som skjuler sensitive detaljer

Se [SECURITY.md](docs/SECURITY.md) for fullstendig sikkerhetsdokumentasjon.

## 🔧 Feilsøking

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
sudo journalctl -u mongod -f

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

## 📝 Lisens

Dette prosjektet er laget for undervisningsformål som del av praktisk eksamen i IT.

## 👥 Kontakt

For spørsmål eller problemer, kontakt IT-administrator.