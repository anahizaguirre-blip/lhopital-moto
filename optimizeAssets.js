import { unlinkSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDir = join(__dirname, "public");

const imageExtensions = [".jpg", ".jpeg", ".png", ".svg"];
const skipFolders = ["catalogues"]; // folders to exclude
const skipExtensions = [".webm", ".ttf", ".otf", ".webp"];

// Convert to WebP
const convertToWebp = async (filePath) => {
	const ext = extname(filePath).toLowerCase();
	if (!imageExtensions.includes(ext)) return;

	const webpPath = filePath.slice(0, -ext.length) + ".webp";

	const isLogo = /logo|escudo/i.test(filePath);

	try {
		await sharp(filePath)
			.webp(isLogo ? { lossless: true } : { quality: 80 })
			.toFile(webpPath);
		unlinkSync(filePath); // remove original

		console.log(
			`✅ Converted: ${filePath.replace(process.cwd() + "/", "")} → ${webpPath.replace(process.cwd() + "/", "")}`
		);
	} catch (err) {
		console.error(`❌ Error converting ${filePath}:`, err.message);
	}
};

// Recursively walk folders
const walkDir = async (dir) => {
	const files = readdirSync(dir);

	for (const file of files) {
		const fullPath = join(dir, file);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			if (!skipFolders.includes(basename(fullPath))) {
				await walkDir(fullPath);
			}
			continue;
		}

		const ext = extname(fullPath).toLowerCase();
		if (skipExtensions.includes(ext)) continue;

		await convertToWebp(fullPath);
	}
};

// Run the script
walkDir(inputDir)
	.then(() => console.log("🎉 Done converting images."))
	.catch((err) => console.error("🚨 Error:", err));
