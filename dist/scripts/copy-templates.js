import fs from "node:fs";
import path from "node:path";
const sourceDir = path.resolve("src/templates");
const targetDir = path.resolve("dist/templates");
function copyDirectory(source, target) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);
        if (entry.isDirectory()) {
            copyDirectory(sourcePath, targetPath);
            continue;
        }
        if (entry.name === "textlintrc.base.json") {
            continue;
        }
        fs.copyFileSync(sourcePath, targetPath);
    }
}
copyDirectory(sourceDir, targetDir);
//# sourceMappingURL=copy-templates.js.map