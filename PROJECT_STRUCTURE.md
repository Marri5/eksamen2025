# Fox Voting System - Prosjektstruktur

```
fox-voting-system/
├── README.md                    # Hovedinstruksjoner og oversikt
├── package.json                 # Node.js avhengigheter og scripts
├── env.template                 # Miljøvariabler mal
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
│       └── images/
│           └── .gitkeep        # Placeholder for images
│
├── scripts/                     # Deployment scripts
│   ├── setup-mongodb.sh        # MongoDB oppsett
│   ├── setup-backend.sh        # Backend server oppsett
│   └── setup-frontend.sh       # Frontend server oppsett
│
└── docs/                        # Dokumentasjon
    ├── PROJECT_OUTLINE.md       # Prosjektskisse og arkitektur
    ├── SECURITY.md              # Sikkerhetsdokumentasjon
    └── DEPLOYMENT_CHECKLIST.md  # Deployment sjekkliste
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

### Konfigurasjonsfiler
- **package.json**: Definerer alle npm-avhengigheter og kjørescript
- **env.template**: Mal for miljøvariabler (må kopieres til .env)

### Deployment-scripts
- **setup-mongodb.sh**: Automatisk oppsett av MongoDB med sikkerhetskonfigurasjon
- **setup-backend.sh**: Installerer Node.js, PM2, og konfigurerer backend
- **setup-frontend.sh**: Installerer Node.js, PM2, Nginx, og konfigurerer frontend

### Dokumentasjon
- **PROJECT_OUTLINE.md**: Detaljert systemarkitektur og dataflyt
- **SECURITY.md**: Sikkerhetstrusler og tiltak
- **DEPLOYMENT_CHECKLIST.md**: Steg-for-steg sjekkliste for deployment 