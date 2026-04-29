require("@testing-library/jest-dom");

// Provide `fetch` in Jest/JSDOM so MSW can mock HTTP calls.
require("cross-fetch/polyfill");

// MSW: mock network requests during Jest runs.
const { server } = require("./integration/msw/server.js");

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});