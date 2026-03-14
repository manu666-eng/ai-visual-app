const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/*",
      "node_modules/*"
    ],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
]);