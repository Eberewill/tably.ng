import { readFile } from "node:fs/promises";

const files = [
  "packages/ui/src/tokens.css",
  "apps/customer-web/src/main.tsx",
  "apps/customer-web/src/style.css",
  "apps/restaurant-web/src/main.tsx",
  "apps/restaurant-web/src/style.css",
  "apps/restaurant-desktop/src/main.tsx",
  "apps/restaurant-desktop/src/style.css",
];
const forbidden = [
  [/\b(?:radial|linear)-gradient\(/, "gradients are not part of the system"],
  [/backdrop-filter\s*:/, "glass effects are not part of the system"],
  [/border-radius\s*:\s*999/, "pills are reserved for compact chips and statuses"],
  [/box-shadow\s*:/, "shadows are reserved for transient overlays"],
  [/font-weight\s*:\s*[78]00/, "use hierarchy, not heavy display weights"],
];

const sources = await Promise.all(files.map(async (file) => [file, await readFile(file, "utf8")]));
const failures = sources.flatMap(([file, source]) => forbidden.flatMap(([rule, message]) => rule.test(source) ? [`${file}: ${message}`] : []));
const tokenSource = sources[0][1];
for (const token of ["#f8f5ef", "#1c1c18", "#b95332", "--radius-control: 10px", "--duration-base: 220ms"]) {
  if (!tokenSource.includes(token)) failures.push(`packages/ui/src/tokens.css: missing required token ${token}`);
}
for (const [file, source] of sources.filter(([file]) => file.endsWith("main.tsx"))) {
  if (!source.includes('@tably/ui/tokens.css')) failures.push(`${file}: must import shared design tokens`);
}
if (failures.length) {
  console.error("Design-system check failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Design-system check passed.");
