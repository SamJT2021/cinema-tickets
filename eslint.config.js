import dwpConfigBase from "@dwp/eslint-config-base";

export default [
  ...dwpConfigBase,
  {
    name: "Tests",
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        context: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
];
