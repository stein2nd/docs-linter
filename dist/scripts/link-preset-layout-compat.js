import fs from "node:fs";
import path from "node:path";
/**
 * Mirror presets/* to package-root base/, swift/, wordpress/ for npm layout compat.
 * npm pack does not expand directory symlinks into separate tarball paths.
 */
const PRESET_MIRRORS = [
    { name: "base", source: "presets/base" },
    { name: "swift", source: "presets/swift" },
    { name: "wordpress", source: "presets/wordpress" }
];
const packageRoot = path.resolve(import.meta.dirname, "../..");
function mirrorPresetLayoutCompat() {
    for (const { name, source } of PRESET_MIRRORS) {
        const sourcePath = path.join(packageRoot, source);
        const destPath = path.join(packageRoot, name);
        if (!fs.existsSync(sourcePath)) {
            throw new Error(`Preset source missing: ${source}`);
        }
        if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true, force: true });
        }
        fs.cpSync(sourcePath, destPath, { recursive: true });
    }
    console.log("✅ Preset layout compat mirrors: base/, swift/, wordpress/ (from presets/*)");
}
mirrorPresetLayoutCompat();
//# sourceMappingURL=link-preset-layout-compat.js.map