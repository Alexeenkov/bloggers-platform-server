/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
  testRegex: ".api.test.ts$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
