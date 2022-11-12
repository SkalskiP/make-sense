import '@testing-library/jest-dom';
import crypto from 'crypto';

jest.mock('./App.tsx', () => 'App');


Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr: string | any[]) => crypto.randomBytes(arr.length)
  }
});

import { unmountComponentAtNode } from 'react-dom';

let container: Element | DocumentFragment | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container) {
    unmountComponentAtNode(container);
    container = null;
  }
});