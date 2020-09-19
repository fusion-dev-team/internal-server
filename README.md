Server boilerplate

Installation:

In `config` folder create `config.json` file with next structure:

```
{
  "development": {
    "db": {
      "username": "name",
      "password": "pass",
      "database": "db_name",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "logging": false
    },
    "slack": {
      "conversationId": "CD1231CD",
      "slackToken": "",
      "slackTokenCRM": "xoxb-qweqweqweqweqweqweqwe",
      "codeReviewChannelId": "CD1231CD",
      "codeReviewTeamChannelId": "CD1231CD",
      "CRMChannelId": "CD1231CD",
      "generalId": "",
      "learningChannelId": "",
      "slackMessages": {
      "newAnnouncement": []
      }
    },
    "common": {
      "jwtSecret": "secret",
      "accessTokenExpiresInMS": 172800000,
      "refreshTokenExpiresInMS": 60480000,
      "accessTokenExpiresIn": "2days",
      "refreshTokenExpiresIn": "7days",
      "url": "http://localhost:6800",
      "siteAddress": "http://localhost:3000",
      "crmAddress": "http://localhost:4200",
      "hashType": "md5",
      "hashKey": "hashkey"
    },
    "mail": {
      "serviceEmail": "your@gmail.com",
      "servicePassword": "yourpw",
      "service": "gmail"
    },
    "externalAPI": {
      "linkpreviewUrl": "http://api.linkpreview.net/",
      "linkpreviewApiKey": "apiKey",
      "vapidPrivateKey": "somePrivateKey",
      "vapidPublicKey": "somePublicKey",
      "vapidMail": "email@your.com",
      "calendarSiteUrl": "https://buh.ru/calendar/"
    }
  },
}
```

Create a database with name what you mentioned in `config.json`

run
`npm install`

`npm run migrate`

run `npm test` to be sure that everything is ok

And run server

`npm start`

On `http://localhost:6800/api-docs/` you can try swagger

| Config                        | description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `db`                          | db config                                               |
| username                      | username                                                |
| password                      | passowd for db                                          |
| database                      | name of database                                        |
| host                          | url to db                                               |
| dialect                       | type of db                                              |
| logging                       | should logs br written to console                       |
| slack                         |                                                         |
| conversationId                | channel for admin's notifications                       |
| slackToken                    | token for slack bot                                     |
| codeReviewChannelId           | channel for posting code review requests                |
| codeReviewTeamChannelId       | channel for code review team                            |
| CRMChannelId                  | crm channel                                             |
| generalId                     | general channel                                         |
| learningChannelId             | learning channel                                        |
| slackMessages.newAnnouncement | array of greeting for announcement messages             |
| common                        |                                                         |
| jwtSecret                     | jwt secret key                                          |
| accessTokenExpiresInMS       | token expiration time (in seconds)                      |
| refreshTokenExpiresInMS      | refresh expiration time (in seconds)                    |
| accessTokenExpiresIn          | token expiration time (in days)                         |
| refreshTokenExpiresIn         | refresh expiration time (in days)                       |
| url                           | server url                                              |
| siteAddress                   | frontside url                                           |
| crmAddress                    | crm url                                                 |
| hashType                      | hashing password algorithm                              |
| hashKey                       | hash key                                                |
| mail                          |                                                         |
| serviceEmail                  | notifications email login                               |
| servicePassword               | notifications email password                            |
| service                       | type of email service. eg 'gmail'                       |
| externalAPI                   |                                                         |
| linkpreviewUrl                | linkpreview url. default: "http://api.linkpreview.net/" |
| linkpreviewApiKey             | linkpreview apiKey                                      |
| vapidPrivateKey               | web push api key                                        |
| vapidPublicKey                | web push api key                                        |
| vapidMail                     | web push email                                          |
