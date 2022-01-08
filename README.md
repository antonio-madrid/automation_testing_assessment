# e2y testing exercise
## Basic Overview
This t-shop shows a simple ecommerce application based on `React/Redux` where the clients can buy different t-shirts. 
Clients can filter sizes, order by price and buy as many t-shirts as they want.

Assess the quality of the application by creating different automated test suites. And report any possible inconsistency, if they do exist, during your tests.

#### About the tests
Here, at e2y, we work following the `BDD` (Behaviour Driven Development) process with tools like `Cucumber, WebdriverIO, Cypress, Selenium webdriver, Protractor...`
However, feel free to use any framework in any language.

Please, place your code under `tests` in the root directory.
Besides, evaluate which cases are worthy to be automated or not.

Remember, we are developers! Not only do we worry about the quality of the application but also the quality of the code ;)

## Build/Run
#### Requirements
- Node.js version 12 (lts/erbium)
- Docker

```bash
##### With Docker

# Build the image and fire up the container
docker-compose up -d --build

# Bring down the container before moving on
docker-compose stop


##### Without Docker (locally)

# First, Install the needed packages
npm install

# Then start both Node and React
npm start
```

Using docker the application will be available under `http://localhost:3001`. Otherwise, it will be under port `3000`.


<sub>Special thanks to <a href="http://www.jeffersonribeiro.com/">Jefferson Ribeiro</a> and all contributors for this amazing <a href="https://github.com/damonpam/react-shopping-cart/tree/staging">shopping cart.</a></sub>
