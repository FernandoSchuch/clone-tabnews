const nextJest = require("next/jest");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./.env.development" });

const createJestConfig = nextJest({
  dir: ".",
});
const JestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = JestConfig;
