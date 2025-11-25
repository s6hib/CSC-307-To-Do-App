import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({})
  })
);
