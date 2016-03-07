# REST API that acts as a proxy between Google QPX flight search API
The API prototype take various search parameters, query a 3rd party API and return the results as JSON.

### Install
```bash
npm install
```

### To run
```bash
npm start
```

### To run in debug mode
```bash
npm run debug
```

## Config

To be able to query the Google QPX API an API Key is necessary. The parameter _googleDevApiKey_ in the __config.json__ has to be set to match your setup. I left mine there, but it will get deactivated now.