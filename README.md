:warning: This repository is still in development phase and is in active development. Don't expect anything to work yet!

[![Build Status](https://travis-ci.org/burst-digital/hn-react-webform.svg?branch=master)](https://travis-ci.org/burst-digital/hn-react-webform)
[![bitHound Overall Score](https://www.bithound.io/github/burst-digital/hn-react-webform/badges/score.svg)](https://www.bithound.io/github/burst-digital/hn-react-webform)

# HN-React-Webform
With this awesome React component, you can render complete Drupal Webforms in React. With validation, easy custom styling and a modern, clean interface.

## Installation

First, install *hn-react-webform* in your project:
```bash
$ npm install hn-react-webform
# or
$ yarn add hn-react-webform
```
Then, import the component:
```javascript
// ES6
import Webform from 'hn-react-webform';
// ES5
var Webform = require('hn-react-webform').default;
```
This project uses *CSS Modules*, *CSS.next* and *ES7* to ease styling. Your web-bundler (like Webpack) needs to support *CSS Modules* to correctly parse all styling. 
# Contributing

If you want to help contributing, follow these steps:

1. Clone this repo
2. `cd` into the folder
3. Run `npm install`
5. Run `npm run storybook`
6. Edit files in `/src` and view changes on http://localhost:6006/


If you want to contribute and to use this version of the module in a different project on your local machine without storybook, run `npm link`
