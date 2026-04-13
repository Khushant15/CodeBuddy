const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../lib/curriculum');
const destDir = path.join(__dirname, '../public/curriculum');

/**
 * Recursively syncs directory structure and copies JSON files
 */
function syncCurriculum(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      syncCurriculum(srcPath, destPath);
    } else if (entry.name.endsWith('.json')) {
      console.log(`Syncing: ${entry.name}`);
      fs.copyFileSync(srcPath, destPath);
      
      /* 
      // Removed legacy support root copy to keep public/curriculum clean
      if (entry.name.includes('module') && !entry.name.includes('index')) {
        fs.copyFileSync(srcPath, path.join(destDir, entry.name));
      }
      */
    }
  }
}

console.log('--- CURRICULUM SYNC START ---');
console.log(`Source: ${srcDir}`);
console.log(`Dest: ${destDir}`);

try {
  syncCurriculum(srcDir, destDir);
  console.log('✅ Curriculum synced successfully with folder preservation!');
} catch (err) {
  console.error('❌ Sync failed:', err);
  process.exit(1);
}
