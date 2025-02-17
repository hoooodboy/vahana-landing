import { defineConfig } from "orval";

export default defineConfig({
  vahana: {
    output: {
      mode: "tags-split",
      target: "endpoints/vahanaFromFileSpecWithTransformer.ts",
      client: "react-query",
      schemas: "model",
      mock: false,
      headers: true,
      clean: true,
      override: {
        useTypeOverInterfaces: true,
        mutator: {
          path: "mutator/customAxios.ts",
          name: "customAxios",
        },
        operations: {},
        query: {
          useQuery: true,
          signal: true,
        },
      },
    },
    input: {
      target: "http://192.168.0.109:3000/api/docs.json",
      override: {
        transformer: "transformer/input-filter.js",
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
