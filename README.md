# Tekana-eWallet

Welcome to Tekana-eWallet, a robust and safest place to store your money and transact easily

---

# Strategy

Step 1: Understand the problem

- Functional requirements

- Non-functional requirements

Step 2: High-level design

- Service API

- Wallet

Step 3: Security

## Elaboration

**Step 1: Understand the problem**

A digital wallet can mean very different things to different people. Some may think it’s a just digital wallet like Apple Pay or Google Pay. Others may think it’s a backend system that handles payments such as PayPal or Stripe. It is very important to determine the exact requirements at the beginning, and that's where I'll be involving business people in agile methodology

**_Functional requirements_**

Here business people may suggest different features like:

- Login
- Register
- Topup your wallet
- View your transactions
- etc...

**_Non-Functional requirements_**

And then some non-functional requirements that accompanies the above listed may be something like:

- Reliability
- Fault tolerance

**Step 2 - Propose High-Level Design**

Since the business people would like to make the system faster, more robust, secure and flexible, I would propose a distributed system where each service can be developed independently in any language and more importantly scalable on it's own.

There are two types of communication patterns that internal services use to communicate: **synchronous** vs **asynchronous**. both have pros and cons.

**_Synchronous communication_**

Synchronous communication like HTTP works well for small-scale systems, but its shortcomings become obvious as the scale increases. It creates a long request and response cycle that depends on many services. The drawbacks of this approach are:

- Low performance. If any one of the services in the chain doesn’t perform well, the whole system is impacted.

- Tight coupling. The request sender needs to know the recipient.

- Hard to scale.it’s not easy to scale the system to support a sudden increase in traffic.

**_Asynchronous communication_**

Here in asynchronous communication, each request (message) is processed by multiple services. Kafka works well here. When consumers receive messages, they are not removed from Kafka. The same message can be processed by different services. This model maps well to our tekana-ewallet system, as the same request might trigger multiple side effects such as sending push notifications, analytics, etc. An example is illustrated down below.

![alt text](./assets/design-preview.png)

Generally speaking, synchronous communication is simpler in design, but it doesn’t allow services to be autonomous. Asynchronous communication trades design simplicity and consistency for scalability and failure resilience. For a large-scale system asynchronous communication is a better choice.

And since I'll be going with distributed systems communicating asynchronously I would use complimentary design patterns like CQRS, Event-driven architecture and Orchestration.

**Payment security**

Security is very important. I can suggest different techniques to combat cyberattacks.

| Problem                                     | Solution                                 |
| ------------------------------------------- | ---------------------------------------- |
| Request/Response eavesdropping              | Use HTTPS                                |
| Data loss                                   | Data duplication across multiple regions |
| Distributed denial of service attack (DDoS) | Rate limiting and firewall               |

# System documentation

## Pre-requisites

- Docker

## Installing

- Install [Docker](https://docs.docker.com/get-docker/) if you dont have it installed.

## Getting Started

1. Git clone this repository && cd to the project directory

```
git clone https://github.com/amilykassim/Tekana-eWallet.git
```

## Run the project

#### Using VSCode or any of your favorite editor

P.S: Before starting up the containers make sure the following ports are not in use to avoid any conflict.

```
Ports: (6379, 29092, 5432, 3000, 4000)
```

Run `docker-compose up` to start tekana api and wallet microservice containers

Congratulations! You have successfully launched the App.

## To check if the APP is up and running.

```
http://localhost:3000/<endpoint>
```

## Endpoints

### User:

| Method | Endpoint              | Enable a user to:                     |
| ------ | --------------------- | ------------------------------------- |
| GET    | /                     | Check if tekana app is up and running |
| POST   | /auth/register        | Register as a customer                |
| POST   | /auth/login           | Login as a customer                   |
| GET    | /wallets/balance      | Get your wallet balance               |
| POST   | /wallets/topUp        | Add money to your wallet              |
| GET    | /wallets/transactions | Get your account transactions         |
| GET    | /wallets              | Get your wallet                       |
| GET    | /users                | Get your profile                      |

### Admin:

| Method | Endpoint              | Enable a user to:                     |
| ------ | --------------------- | ------------------------------------- |
| GET    | /                     | Check if tekana app is up and running |
| POST   | /auth/login           | Login as an admin                     |
| GET    | /wallets/transactions | Get all accounts transactions         |
| GET    | /wallets              | Get all wallets                       |
| GET    | /users                | Get all users                         |

#### Register

Method: POST

Endpoint: /auth/register

Payload:

```
{
    "name": "amily",
    "email": "a@gmail.com",
    "password": "HeloP1#"
}
```

Happy path

```
{
    "statusCode": 201,
    "data": {
        "user": {
            "name": "Amiliy",
            "email": "aa@gmail.com",
            "isAdmin": false,
            "id": "6005ce5e-4e21-400c-987b-7ae0ea9e23ba",
            "createdAt": "2022-12-28T02:26:37.230Z",
            "updatedAt": "2022-12-28T02:26:37.230Z"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDA1Y2U1ZS00ZTIxLTQwMGMtOTg3Yi03YWUwZWE5ZTIzYmEiLCJlbWFpbCI6ImFhQGdtYWlsLmNvbSIsIm5hbWUiOiJBbWlsaXkiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjcyMTk0Mzk3LCJleHAiOjE2NzIyODA3OTd9.PMQcYoI-xWMVdzf6z0wBDMvwfm1dI1s-q4vx_u1Lbut"
    }
}
```

Sad path path

```
{
    "statusCode": 400,
    "message": "Email is already taken, try another one"
}
```

#### Login

Method: POST

Endpoint: /auth/login

Payload:

```
{
    "name": "amily",
    "email": "a@gmail.com",
    "password": "HeloP1#"
}
```

Happy path

```
{
    "statusCode": 200,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDA1Y2U1ZS00ZTIxLTQwMGMtOTg3Yi03YWUwZWE5ZTIzYmEiLCJlbWFpbCI6ImFhQGdtYWlsLmNvbSIsIm5hbWUiOiJBbWlsaXkiLCJpYXQiOjE2NzIxOTQ0NDUsImV4cCI6MTY3MjI4MDg0NX0.sacvtLzHrEZkaiL0ZjC9l1FZDkAEFSlhVHIy_zx6gqt"
    }
}
```

Sad path path

```
{
    "statusCode": 400,
    "message": "Invalid email or password"
}
```

#### Get balance

Method: GET

Authentication: provide the access_token as a bearer token on every request

![alt text](./assets/access_token.png)

Endpoint: /wallets/balance

Payload:
N/A

Happy path

```
{
    "statusCode": 200,
    "data": {
        "balance": 30000
    }
}
```

Sad path path

```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

#### Topup

Method: POST

Authentication: provide the access_token as a bearer token on every request

Endpoint: /wallets/topUp

Payload:

```
{
    "amount": 10000
}
```

Happy path

```
{
    "statusCode": 200,
    "data": {
        "txnId": "7f660459-7263-48c9-a2cc-6bd1ce73fed3",
        "txnDescription": "DEPOSIT",
        "txnDate": "2022-12-28T02:17:18.144Z",
        "balance": 30000
    }
}
```

Sad path path

```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

#### Get transactions

Method: GET

Authentication: provide the access_token as a bearer token on every request

Endpoint: /wallets/transactions

Payload:
N/A

Happy path

```
{
    "statusCode": 200,
    "data": {
        "totalTransactions": 2,
        "foundTransactions": [
            {
                "id": "b41066f6-4f85-4e94-84b5-4bc263fe2a34",
                "description": "DEPOSIT",
                "amount": "10000",
                "type": "TOP_UP",
                "createdAt": "2022-12-28T01:55:23.894Z",
                "updatedAt": "2022-12-28T01:55:23.894Z"
            },
            {
                "id": "649b6c5c-a4a4-4e2e-acf7-dcc9530e77a1",
                "description": "DEPOSIT",
                "amount": "10000",
                "type": "TOP_UP",
                "createdAt": "2022-12-28T01:55:56.166Z",
                "updatedAt": "2022-12-28T01:55:56.166Z"
            }
        ]
    }
}
```

Sad path path

```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

#### Get wallets

Method: GET

Authentication: provide the access_token as a bearer token on every request

Endpoint: /wallets/transactions

Payload:
N/A

Happy path

```
{
    "statusCode": 200,
    "data": {
        "totalWallets": 1,
        "foundWallets": [
            {
                "id": "7e3f2128-d9ae-42dd-8b51-488e257adb37",
                "balance": "10000",
                "createdAt": "2022-12-28T01:55:04.931Z",
                "updatedAt": "2022-12-28T01:55:23.920Z"
            }
        ]
    }
}
```

Sad path path

```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

#### Get users

Method: GET

Authentication: provide the access_token as a bearer token on every request

Endpoint: /wallets/transactions

Payload:
N/A

Happy path

```
{
    "statusCode": 200,
    "data": {
        "totalUsers": 1,
        "foundUsers": [
            {
                "id": "8e7df35b-b991-4cba-9a7e-6961d88a8385",
                "name": "Lionelll",
                "email": "abcc@gmail.com",
                "password": "$2b$10$.niwSPzPelmdqdcv4JrCTetjjJPfMO8qMeAP9WRgvHZAcj/EFJO2a",
                "createdAt": "2022-12-28T01:55:04.809Z",
                "updatedAt": "2022-12-28T01:55:04.809Z"
            }
        ]
    }
}
```

Sad path path

```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

## Tests

To run the tests:

1.  Go to api directory `cd api`
2.  Replace envs in `.env` file with the envs of `.env.test` file
3.  Run `npm run test`

## Known issues

For the sake of time, I haven't got the opportunity to implement the following:

- Add data migration script to pre-populate the database with admin users, for now in order to make a user an admin, you'll need to go in your database and change the `isAdmin` field from `false` to `true`.

- Roll-back on transactions failures

- Idempotency

## Authors

- **Amily Kassim** (https://github.com/amilykassim)

## Licence

This software is published by `Amily Kassim` under the [MIT licence](http://opensource.org/licenses/MIT).
