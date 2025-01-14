import * as fs from "fs";
import * as path from "path";

const schemaDir = path.join(process.cwd(), "src", "server", "db", "schema");

function collectSchemaFiles(dir: string): string {
  let output = "";

  // Read all files in the directory
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, recurse into it
      output += `\n\n# Directory: ${file}\n`;
      output += collectSchemaFiles(filePath);
    } else if (file.endsWith(".ts")) {
      // If it's a TypeScript file, read its contents
      output += `\n\n## File: ${file}\n\`\`\`typescript\n`;
      output += fs.readFileSync(filePath, "utf8");
      output += "\n```\n";
    }
  });

  return output;
}

// Collect all schema files
const schemaContent = collectSchemaFiles(schemaDir);

// Write to output file
const outputPath = path.join(process.cwd(), "schema-documentation.md");
fs.writeFileSync(outputPath, schemaContent);

console.log("Schema documentation has been written to schema-documentation.md");
