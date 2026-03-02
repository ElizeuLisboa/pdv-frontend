// rename-jsx.js
const fs = require("fs");
const path = require("path");

function isJsx(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return /<[^>]+>/.test(content); // detecta presença de tags JSX
}

function renameJsToJsx(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      renameJsToJsx(fullPath); // recursivamente
    } else if (path.extname(fullPath) === ".js") {
      if (isJsx(fullPath)) {
        const newPath = fullPath.replace(/\.js$/, ".jsx");
        fs.renameSync(fullPath, newPath);
        console.log(`✔️  Renomeado: ${file} → ${path.basename(newPath)}`);
      }
    }
  });
}

// Iniciar pela pasta 'src'
renameJsToJsx(path.join(__dirname, "src"));
