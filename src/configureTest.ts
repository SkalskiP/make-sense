import "@testing-library/jest-dom";


import configureStore from 'redux-mock-store';

const middlewares = []; // add your middlewares like `redux-thunk`

jest.mock("./App.tsx", () => "App");

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length)
  }
});

import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  container.setAttribute("id", "root");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});