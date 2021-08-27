# fetch-rewards-test

Coding test for Fetch Rewards Backend Engineer, Apprenticeship

## Install

    clone repository to machine

## Run the app

    npm start

# REST API

## Get balances by payer

### Request

`GET /balance/`

    curl -i -H 'Accept: application/json' http://localhost:3001/balance/

### Response

    TP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 51
    ETag: W/"33-Cz46YRVGZomO7YUSwNcwKEjE0rM"
    Date: Fri, 27 Aug 2021 18:37:55 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"DANNON":1100,"UNILEVER":200,"MILLER COORS":10000}


## Create a new transaction

### Request

`POST /transaction/`

    curl -i -H 'Accept: application/json' -d 'payer=Dannon&points=1000&timestamp=2020-11-02T14:00:00Z' http://localhost:3001/transaction

### Response

    TP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 84
    ETag: W/"54-n33Gxj/GqOZUesoo8U4JCN4Mv9Y"
    Date: Fri, 27 Aug 2021 18:41:55 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {"payer":"Dannon","points":"1000","timestamp":"2020-10-31T15:00:00Z","pointsSpent":0}


## Spend points

### Request

`POST /spend`

    curl -i -H 'Accept: application/json' -d 'points=5000' http://localhost:3001/spend

### Response

    TP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 109
    ETag: W/"6d-69egoeavYBfLCR89GB2KNPO18Y4"
    Date: Fri, 27 Aug 2021 18:46:36 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    [{"payer":"DANNON","points":-100},{"payer":"UNILEVER","points":-200},{"payer":"MILLER COORS","points":-4700}]


## Spend more than available points

### Request

`POST /spend`

    curl -i -H 'Accept: application/json' -d 'points:20000' http://localhost:3001/spend

### Response

    TP/1.1 400 Bad Request
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 29
    ETag: W/"1d-0C0G1zStv/EsW9aa014v0cuRTSc"
    Date: Fri, 27 Aug 2021 18:47:44 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    "Not enough points to spend!"