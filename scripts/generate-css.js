import fs from "fs";
import path from "path";

// Configuration
const SVG_DIR = "./svg";
const OUTPUT_CSS = "./css/dango-icons.css";
const PREFIX = "dango";
const REPO = "https://github.com/reizumii/dango";

async function generateCss() {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_CSS);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(SVG_DIR);
    const svgFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".svg",
    );

    if (!svgFiles.length) {
      console.log(`⚠️ No SVG files found in ${SVG_DIR}`);
      return;
    }

    let cssContent = `/*\n  Dango\n  ${REPO}\n*/\n\n:root {\n`;

    for (const file of svgFiles) {
      const filePath = path.resolve(SVG_DIR, file);
      const rawSvg = fs.readFileSync(filePath, "utf8").trim();

      // Convert to URL-encoded data URI (with character exceptions)
      const miniSvgData = encodeURIComponent(rawSvg)
        .replace(/%20/g, " ")
        .replace(/%22/g, "'")
        .replace(/%3A/g, ":")
        .replace(/%2F/g, "/")
        .replace(/%2C/g, ",")
        .replace(/%3D/g, "=");

      const dataUri = `data:image/svg+xml,${miniSvgData}`;

      // Create clean variable name
      const iconName = path
        .parse(file)
        .name.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      cssContent += `  --${PREFIX}-${iconName}: url("${dataUri}");\n`;
      console.log(`✅ ${file} -> ${PREFIX}-${iconName}`);
    }
    cssContent += "}\n";

    // Write to CSS file
    fs.writeFileSync(OUTPUT_CSS, cssContent, "utf8");
    console.log(
      `\n🍡 Success! CSS file generated at: ${OUTPUT_CSS} (${svgFiles.length} icons)`,
    );
  } catch (error) {
    console.error("❌ Error processing SVGs:", error);
  }
}

generateCss();
