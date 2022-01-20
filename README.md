# Automation exercise

## General description

eCommerce automation testing proof of concept.

# Development environment

Project developer under **Node.js v16.13.1 LTS** and **TypeScript v4.5.2**.
Dependencies are handled through **NPM** and describe in [package.json](package.json).

#### Environment variables

- Environment variables are set into [_.env_](.env) file.

## Build

### Code building

Code is compiled through `npx` command and mapped by **ts-jest**.

### Docker building

[Under construction]  
To start the project up through Docker, use `docker-compose up` and `docker-compose down` to stop project running.

## Testing

- `npm test` - Execute all tests.
- `npm test testName-Number` - Execute a single tests
  - e.g.
    - `npm test TESTING-0001` - Execute test TESTING-0001
- `npm run e2e` - Execute all e2e tests
- `npm run endpoints` - Execute all endpoint tests
- `npm run debug testName-Number` - Execute the given test in Playwright full debug mode and show its inspector.
  - e.g.
    - `npm run debug TESTING-0002`

Use `await page.pause();` to create Playwright breakpoints when debugging, or use that sentence in `npm test` to have the light debug mode.

## Docker

In order to run the app on Docker, follow this commands:

- `docker-compose up` - to create the Docker image
- `docker run -it --network=host exercise_app bash` - to run Docker

When running the targeted application (eCommerce), this is executed on localhost.
So, to allow Docker reaching the host localhost, the flag **--network=host** is needed.  
This will expose host network to Docker, removing Docker isolation feature, that is a bad practice, but for this testing purpose is acceptable.

To run any test under Docker environment, flag `env=prod` must be set.  
This will run Playwright in headless mode, the only mode able to be running on no GUI OS as Ubuntu Docker image.

- `npm test env=prod testName`

In addition, `npm run docker:test` will run all the test suite.  
It will take so long because the Jest image comparison. Probably Playwright image comparison works better.

## Monitoring

There is an endpoint test which could be deployed on a pipeline in order to monitoring that eCommerce application is still up.
That pipeline may be execute every 15 minutes. This way, if pipeline fails, that would mean eCommerce app is down.  
Also, a logger could be embedded on this test, to send a message by Kibana, Datadog, Sentry or similar.

#### Ideas:

- I thought to make a file per Page Object to store the selectors,
  this way, you could exchange selectors depending of environment. This would allow test on dev, test or prod.

#### TODO:

- Use facades as CartComponent to encapsulate list of complex Page Object actions.
- Breaking test, e.g. order 100000 shirts in order to stress the app.
- Refactor
- Unify functions, naming, etc
- Create more tests
- Expand the 'Happy path' test case

#### Why like this

- I have chosen this stack (Jest + Playwright + Axios), because is my current one, and researching about how to use standalone would be required too much time. But Playwright works better by itself.

#### Problems found

- Elements have no ids, that made me spend more time than I expected to find proper CSS Selectors or workarounds to point concrete elements.
- One of the elements are repeated, same name, different product. "Cat Tee Black T-Shirt".
