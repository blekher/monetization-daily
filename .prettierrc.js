export default {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:playwright/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // Custom ESLint rules
    "no-unused-vars": "warn",
    "no-console": "off",
  },
};
