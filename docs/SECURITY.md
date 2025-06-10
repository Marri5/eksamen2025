# Sikkerhetsdokumentasjon - Fox Voting System

## Identifiserte sikkerhetstrusler

### 1. SQL/NoSQL Injection
**Trussel**: Ondsinnede brukere kan forsøke å injisere skadelig kode via input-felter.

**Tiltak**:
- Bruker Mongoose ODM som automatisk saniterer input
- Parameteriserte queries
- Input-validering på alle API-endepunkter
- Streng typing av data

### 2. Cross-Site Scripting (XSS)
**Trussel**: Injeksjon av skadelig JavaScript i websiden.

**Tiltak**:
- EJS escaper automatisk output
- Content Security Policy headers
- Validering av all brukerinput
- Sanitering av data før visning

### 3. Distributed Denial of Service (DDoS)
**Trussel**: Overbelastning av servere med falske forespørsler.

**Tiltak**:
- Rate limiting på API-endepunkter
- Nginx som reverse proxy med rate limiting
- PM2 for automatisk restart ved krasj
- Firewall-regler for å blokkere mistenkelig trafikk

### 4. Man-in-the-Middle (MITM) angrep
**Trussel**: Avlytting eller manipulering av kommunikasjon.

**Tiltak**:
- HTTPS kan implementeres med Let's Encrypt
- Sikre cookies med httpOnly og secure flags
- Validering av all kommunikasjon mellom tjenester

### 5. Uautorisert databasetilgang
**Trussel**: Direkte tilgang til MongoDB fra internett.

**Tiltak**:
- MongoDB binder kun til intern IP (10.12.91.102)
- Firewall blokkerer ekstern tilgang til port 27017
- Kun backend-server har tilgang til database
- Kan implementere MongoDB autentisering

### 6. Session Hijacking
**Trussel**: Stjeling av brukersesjoner.

**Tiltak**:
- Ingen persistente sesjoner (stateless arkitektur)
- Hver avstemning er uavhengig
- Ingen sensitive brukerdata lagres

## Implementerte sikkerhetstiltak

### Nettverkssikkerhet
```bash
# MongoDB server (10.12.91.102)
sudo ufw allow from 10.12.91.101 to any port 27017
sudo ufw deny 27017

# Backend server (10.12.91.101)
sudo ufw allow from 10.12.91.103 to any port 5000

# Frontend server (10.12.91.103)
sudo ufw allow 80
sudo ufw allow 443
```

### Applikasjonssikkerhet

#### CORS-konfigurasjon
```javascript
app.use(cors({
  origin: 'http://10.12.91.103:3000',
  credentials: true
}));
```

#### Input-validering
```javascript
if (!imageUrl || typeof imageUrl !== 'string') {
  return res.status(400).json({ 
    success: false, 
    message: 'Ugyldig input' 
  });
}
```

#### Feilhåndtering
```javascript
// Generisk feilmelding til brukere
res.status(500).json({ 
  success: false, 
  message: 'En feil oppstod. Vennligst prøv igjen.' 
});
// Detaljert logging kun til server
console.error('Detailed error:', error);
```

## Anbefalte tilleggstiltak

### 1. HTTPS implementering
```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generer SSL-sertifikat
sudo certbot --nginx -d your-domain.com
```

### 2. Rate limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutter
  max: 100 // Maks 100 requests per IP
});

app.use('/api/', limiter);
```

### 3. Security headers
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. MongoDB autentisering
```javascript
// I mongod.conf
security:
  authorization: enabled

// Opprett bruker
use admin
db.createUser({
  user: "foxvoting",
  pwd: "strongpassword",
  roles: [{ role: "readWrite", db: "foxvoting" }]
})
```

### 5. Logging og overvåking
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Incident Response Plan

### Ved mistanke om sikkerhetsbrudd:

1. **Isoler affected system**
   ```bash
   sudo ufw deny from any
   ```

2. **Analyser logger**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   pm2 logs
   ```

3. **Dokumenter hendelsen**
   - Tidspunkt
   - Type angrep
   - Affected systemer
   - Tiltak som ble gjort

4. **Gjenopprett fra backup**
   ```bash
   mongorestore --db foxvoting /path/to/backup
   ```

5. **Implementer tiltak**
   - Patch sårbarheter
   - Oppdater firewall-regler
   - Styrk autentisering

## Sikkerhetssjekkliste

- [ ] Firewall konfigurert på alle servere
- [ ] MongoDB kun tilgjengelig internt
- [ ] Input-validering implementert
- [ ] Feilhåndtering skjuler sensitive detaljer
- [ ] CORS korrekt konfigurert
- [ ] PM2 konfigurert for automatisk restart
- [ ] Backup-rutiner etablert
- [ ] Logging aktivert
- [ ] Security headers implementert
- [ ] Rate limiting aktivert 