Elements have no ids.

# Ideas:

- I thought to make a file per Page Object to store the selectors,
  this way, you could exchange selectors depending of environment. This would allow test on dev, test or prod.

# TODO:

- normalize current and expected values

# Why like this

- I have chosen this stack (Jest + Playwright), because is my current one, but Playwright works better by itself
- The idea is just using Playwright without Jest or Axios for API testing
