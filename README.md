# Score Card

A progressive web app and Alexa Skill to record scores for board games and card
games.

## Why

I rarely have paper and a pen handy to keep score and using generic note apps on
my phone is a bit tedious. Using an Alexa Skill makes it easier for everyone to
record scores and work out the current scores without breaking up the flow of
the game. Also, having a web app means that I don't need to have an
Alexa-enabled device to use it. In addition, the fact that the scores are
updated live means that it can be used as a leaderboard on a screen somewhere
but updated through Alexa.

## Design

### Event-sourcing

Underpinning both the web app and the Alexa Skill is a shared domain model of
how users record scores for games. Taking inspiration from
Domain-Driven-Development and Redux, this is defined as a set of possible events
that users may initiate along with a reducer that turns a series of events inspirationthe state of a game. This makes several of the features of this app
easier to implement:

* Having a web and Alexa interface to the same data
* Storing game state in multiple places (every client **and** the server) but
  still being able reconcile them
* Ensuring that the web app performs identically offline as it would online
  without any other viewers connected

### Packages

This is split into three packages:

* **score-card-domain**: The shared domain model (events and how to turn them
  into game state)
* **score-card-web-ui**: A React and Redux front-end app created using
  create-react-app
* **score-card-server**: An express server which:
  * Hosts the Alexa Skill
  * Serves the web app
  * Uses websockets to ensure all web apps viewing a game are informed when any
    event occurs

## Testing

* Domain: `cd score-card-domain && npm test`
* Web UI: `cd score-card-web-ui && yarn test`
* Server: `cd score-card-server && npm test`

## Development

### Web app

`yarn start` runs the development create-react-app server, which opens a browser
tab at localhost:3000 with the app running. It will reload automatically when
any web app files change. It also proxies any requests from the app to the
server. The app stores all domain events in IndexedDB, so it may be necessary to
clear that database for certain tasks.

### Server

`npm start` runs the server, setting up MongoDB to point to a remote heroku
database (so this doesn't need to be set up locally). This requires connection
to the correct heroku account - otherwise, export your preferred `MONGODB_URI`
and run `npm run server`. The server runs using nodemon, so will restart
whenever any server files are changed. This closes all open websockets, but the
web app clients will reconnect the next time they attempt to send a message to
the server.

### Alexa Skill

The Alexa Skill is part of the server, so run in the same way. In addition, to
test it using Alexa, use the Alexa part of Amazon's developer portal. After
starting the server locally, install `ngrok` and run `ngrok http 8080`. This
will print out an HTTPS domain that is now proxying to the local server. Copy
this, suffixed with the path `/alexa/score-card`, into the endpoint definition
of the Skill in the developer console. Rebuild the Skill, then test using the
test section.

To make changes to the Skill model, eg adding new utterances or intents, save
them locally, then run `npm run schema`. This outputs the JSON Skill model in
`alexa_skill_schema.json`, which should then be copied into the JSON editor in
the development console and the Skill model rebuilt.

## Releasing new versions

### Web app and server

If the correct heroku account is linked to using the heroku toolbelt, releasing
just requires running `./release.sh` in the root directory. See the results at
https://card-scores.herokuapp.com/

### Alexa Skill

If any changes have been made to the Skill model

* Run `./release.sh`
* Ensure the JSON model on the developer console is up to date
* Deploy the Skill through the console
* EITHER:
  * Deal with any issues Amazon find during certification OR
  * Hope there aren't any
* Wait for an email from Amazon saying the Skill is live
* See the changes on [the Skill store](
  https://www.amazon.co.uk/dp/B07FTQ4BH7/ref=sr_1_11?s=digital-skills&ie=UTF8&qid=1532469411&sr=1-11&keywords=score
  ) or just ask Alexa

## License

[MIT](./LICENSE)
