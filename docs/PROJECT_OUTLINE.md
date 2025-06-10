# Fox Voting System - Prosjektskisse

## Systemarkitektur

### Oversikt over tjenester

```
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│   Frontend Server   │       │   Backend Server    │       │  Database Server    │
│   10.12.91.103      │◄─────►│   10.12.91.101      │◄─────►│   10.12.91.102      │
│                     │ HTTP  │                     │ TCP   │                     │
│   - EJS Templates   │       │   - Express API     │       │   - MongoDB         │
│   - Bootstrap UI    │       │   - Business Logic  │       │   - Data Storage    │
│   - Port 3000/80    │       │   - Port 5000       │       │   - Port 27017      │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘
         ▲                                                              │
         │                                                              │
         │                          Blocked from Internet               │
         │                                                              ▼
    ┌────┴──────┐                                                 ┌──────────┐
    │  Brukere  │                                                 │ Firewall │
    └───────────┘                                                 └──────────┘
```

## Teknologistack

### Frontend (10.12.91.103)
- **Node.js**: JavaScript runtime
- **Express**: Web server framework
- **EJS**: Template engine for server-side rendering
- **Bootstrap 5**: CSS framework for responsive design
- **Font Awesome**: Icon library
- **Nginx**: Reverse proxy (optional)

### Backend (10.12.91.101)
- **Node.js**: JavaScript runtime
- **Express**: REST API framework
- **Mongoose**: MongoDB ODM
- **Axios**: HTTP client for external API calls
- **CORS**: Cross-origin resource sharing middleware

### Database (10.12.91.102)
- **MongoDB**: NoSQL database
- **Konfigurert til kun intern tilgang**

## Dataflyt

### 1. Henting av bilder
```
Bruker → Frontend → Backend → randomfox.ca API
                  ← Bilder ←
```

### 2. Avstemning
```
Bruker → Frontend → Backend → MongoDB
                  ← Bekreftelse ←
```

### 3. Statistikk
```
Bruker → Frontend → Backend → MongoDB
                  ← Statistikkdata ←
```

## API-endepunkter

### Backend API (10.12.91.101:5000)

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/foxes/random` | Henter to tilfeldige revebilder |
| POST | `/api/vote` | Registrerer en stemme |
| GET | `/api/statistics` | Henter avstemningsstatistikk |
| GET | `/api/health` | Helsesjekk for backend |
| GET | `/api/docs` | API-dokumentasjon |

### Frontend Routes (10.12.91.103:3000)

| Route | Beskrivelse |
|-------|-------------|
| `/` | Hovedside med avstemning |
| `/statistics` | Statistikkside |
| `/guide` | Brukerveiledning |

## Databasemodeller

### Fox Collection
```javascript
{
  _id: ObjectId,
  url: String (unik),
  votes: Number,
  lastShown: Date,
  createdAt: Date
}
```

### Vote Collection
```javascript
{
  _id: ObjectId,
  foxId: ObjectId (referanse til Fox),
  timestamp: Date,
  userIp: String (valgfritt)
}
```

## Sikkerhetsarkitektur

### Nettverkssikkerhet
- MongoDB kun tilgjengelig fra backend (10.12.91.101)
- Backend API kun tilgjengelig fra frontend (10.12.91.103)
- Alle servere har lokale brannmurer konfigurert
- Ingen direkte tilgang til database fra internett

### Applikasjonssikkerhet
- CORS konfigurert for kun å tillate frontend
- Input-validering på alle API-endepunkter
- Feilhåndtering som ikke eksponerer sensitive detaljer
- Sikre HTTP-headers via Express middleware

## Deployment-flyt

1. **Database Server (10.12.91.102)**
   - Installer MongoDB
   - Konfigurer for intern tilgang
   - Sett opp brannmur

2. **Backend Server (10.12.91.101)**
   - Installer Node.js
   - Deploy backend-kode
   - Konfigurer PM2
   - Sett opp brannmur

3. **Frontend Server (10.12.91.103)**
   - Installer Node.js og Nginx
   - Deploy frontend-kode
   - Konfigurer PM2
   - Sett opp Nginx reverse proxy

## Skaleringsmuligheter

- **Horisontal skalering**: Kan legge til flere frontend/backend-servere bak en load balancer
- **Database replikering**: MongoDB støtter replica sets for høy tilgjengelighet
- **Caching**: Kan implementere Redis for caching av bilder og statistikk
- **CDN**: Statiske ressurser kan serves via CDN for bedre ytelse 