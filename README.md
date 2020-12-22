# MA_Crawler

A distributed crawler built for my master thesis.
Goal is to collect data and pre-process it from e.g. GitHub.

## Getting Started

### Prerequisites

```
Node.js >= v10
```
[Grakn.ai](https://grakn.ai/) - 1.8.4

[Docker](https://www.docker.com/) (optional)

[Docker-Compose](https://docs.docker.com/compose/) (optional)

### Start

#### Install Packages
```
npm i
```

#### Master
```
GITHUBACCOUNTS='[{"username": "name", "token": "00000"}]' TYPE=master node app.js
```

#### Crawler
```
node app.js
```

#### Docker
```
docker-compose up --build
```


#### Environment Variables
Please look at [config.js](./config.js) for a better overview and understanding.
- PORT - (def) '8000'
- TYPE - (def) 'client' || 'master'
- GRAKNURI - (def) 'localhost:48555'
- SENTRY - (def) ''
- MASTER_SOCKET - (def) 'http://localhost:8000' (Socket of the Master)
- GITHUBACCOUNTS - (def) [] - example '[{"username": "name", "token": "00000"},...]'

