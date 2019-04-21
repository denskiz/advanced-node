const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

// The goal of this code is to add new functions to the page class
// of the pupetteer library
// Add a login() function to it

class CustomPage {
  // static functions can be called without creating an instance of the class itself
  static async build() {
    // create a new browser
    const browser = await puppeteer.launch({
      // no GUI
      headless: true,
      args: ['--no-sandbox']
    });
    // create a new page
    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    // proxy is a es2015 feature
    // proxy here is used to combine access to 3 objects that have been created
    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    // wait for this html element to load on the screen
    await this.page.waitFor('a[href="/auth/logout"]');
  }
  // cleaner than the eval function
  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate(_path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_data)
        }).then(res => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    // wait for all the promises to resolve
    return Promise.all(
      // returns an array of promises
      actions.map(({ method, path, data }) => {
        // get or post function, and then invoke it
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
