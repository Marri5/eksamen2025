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

## 🏗️ Arkitektur

Systemet består av tre separate tjenester:

```
Frontend (EJS + Bootstrap) → Backend (Express API) → Database (MongoDB)
```

Se [PROJECT_OUTLINE.md](docs/PROJECT_OUTLINE.md) for detaljert arkitekturdokumentasjon.

## 📦 Installasjon

### 1. Klon eller kopier prosjektet

```bash
# På hver server
cd /opt
sudo mkdir foxvoting
sudo chown $USER:$USER foxvoting
cd foxvoting
# Kopier relevante filer hit
```

### 2. Installer avhengigheter

```bash
npm install
```

### 3. Konfigurer miljøvariabler

```bash
cp env.template .env
# Rediger .env med riktige verdier
```

## 🚀 Deployment

### Database Server (10.12.91.102)

```bash
cd scripts
chmod +x setup-mongodb.sh
./setup-mongodb.sh
```

### Backend Server (10.12.91.101)

```bash
cd scripts
chmod +x setup-backend.sh
./setup-backend.sh
```

### Frontend Server (10.12.91.103)

```bash
cd scripts
chmod +x setup-frontend.sh
./setup-frontend.sh
```

## 💻 Bruk

### For sluttbrukere

1. Åpne nettleseren og gå til http://10.12.91.103
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