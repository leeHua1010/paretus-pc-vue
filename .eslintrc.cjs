module.exports = {
  env: { browser: true, es2021: true, node: true },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: { ecmaVersion: 12, sourceType: "module" },
  rules: {
    "prefer-const": "error",
    "no-unused-vars": "warn",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  overrides: [
    {
      files: ["*.vue"],
      env: { "vue/setup-compiler-macros": true },
      extends: ["plugin:vue/vue3-essential"],
      parser: "vue-eslint-parser",
      parserOptions: { ecmaVersion: 12, sourceType: "module" },
      rules: {
        "vue/multi-word-component-names": ["error", { ignores: ["index"] }],
        "vue/component-name-in-template-casing": ["error", "kebab-case"],
      },
    },
  ],
};
