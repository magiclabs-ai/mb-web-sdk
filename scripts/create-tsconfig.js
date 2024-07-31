import fs from "node:fs";

const isDev = process.argv.includes("--dev");
const basePaths = "../../configs/tsconfigs/";
const base = JSON.parse(fs.readFileSync(`${basePaths}tsconfig.base.json`, "utf8"));
const specificTsconfigPath = isDev ? `${basePaths}tsconfig.dev.json` : `${basePaths}tsconfig.prod.json`;
const specificTsconfig = JSON.parse(fs.readFileSync(specificTsconfigPath, "utf8"));
const tsconfig = {
  ...base,
  ...specificTsconfig,
};
fs.writeFileSync("../../tsconfig.json", JSON.stringify(tsconfig, null, 2));
