const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const config = require('../src/constants');
const { REQUIRED_ENV_VARIABLES: requiredEnvVariables } = config;

const mode = process.argv[2]; // e.g., development
const method = process.argv[3] || 'symlink'; // copy or symlink

const RemoveFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to remove ${filePath}:`, err.message);
    }
  } else {
    console.log(`ℹ️ File not found: ${filePath}`);
  }
};

if (!mode) {
  console.error('❌ Please provide a mode. Example: node scripts/use-env.js development');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
console.log({ projectRoot });

const pathsToLoad = [
  path.join(projectRoot, 'env', '.env'),
  path.join(projectRoot, 'env', `.env.${mode}`),
  path.join(projectRoot, 'env', `.env.${mode}.local`)
];

console.log({ pathsToLoad });

let mergedEnv = {};

for (const p of pathsToLoad) {
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const parsed = dotenv.parse(content);
    mergedEnv = { ...mergedEnv, ...parsed }; // later files override earlier ones
    console.log({ mergedEnv });
  }
}

// ✅ Validate required variables
const missing = requiredEnvVariables.filter((key) => !mergedEnv[key] || mergedEnv[key].trim() === '');

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables for mode '${mode}':`);
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1);
}

// 🔧 Write merged .env.[mode] to project root
const outputPath = path.join(projectRoot, `.env.${mode}`);
RemoveFile(outputPath);

const envString = Object.entries(mergedEnv)
  .map(([key, val]) => `${key}=${val}`)
  .join('\n');

if (method === 'copy') {
  fs.writeFileSync(outputPath, envString);
  console.log(`✅ Copied merged .env.${mode}`);
} else {
  // Write merged env to temp file, then symlink to .env.[mode]
  const tempPath = path.resolve(projectRoot, `.merged.${mode}.env`);
  fs.writeFileSync(tempPath, envString);
  fs.copyFileSync(tempPath, outputPath);
  RemoveFile(tempPath);
  console.log(`✅ Copied merged env to .env.${mode}`);
}
