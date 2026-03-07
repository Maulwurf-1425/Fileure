const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');

const PORT = 3000;
const STORAGE_FILE = path.join(__dirname, 'settings.json');

// ── PERSISTENT STORAGE ─────────────────────────────────────────────────────
function readStorage() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    }
  } catch(e) { console.warn('settings.json lesen fehlgeschlagen:', e.message); }
  return { settings: {}, bookmarks: [], customQuick: [] };
}

function writeStorage(data) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch(e) {
    console.warn('settings.json schreiben fehlgeschlagen:', e.message);
    return false;
  }
}

// Init file if it doesn't exist
if (!fs.existsSync(STORAGE_FILE)) {
  writeStorage({ settings: {}, bookmarks: [], customQuick: [] });
  console.log('settings.json erstellt:', STORAGE_FILE);
}


function getMimeType(ext) {
  const types = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    '.txt': 'text/plain', '.pdf': 'application/pdf', '.zip': 'application/zip',
  };
  return types[ext] || 'application/octet-stream';
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(name, isDir) {
  if (isDir) return 'dir';
  const ext = path.extname(name).toLowerCase();
  const icons = {
    '.js': 'js', '.ts': 'ts', '.jsx': 'js', '.tsx': 'ts',
    '.html': 'html', '.css': 'css', '.scss': 'css',
    '.json': 'json', '.xml': 'xml', '.yaml': 'yaml', '.yml': 'yaml',
    '.md': 'md', '.txt': 'txt', '.log': 'txt',
    '.png': 'img', '.jpg': 'img', '.jpeg': 'img', '.gif': 'img', '.svg': 'img', '.webp': 'img',
    '.mp3': 'audio', '.wav': 'audio', '.flac': 'audio', '.ogg': 'audio',
    '.mp4': 'video', '.mkv': 'video', '.avi': 'video', '.mov': 'video',
    '.pdf': 'pdf', '.doc': 'doc', '.docx': 'doc', '.xls': 'xls', '.xlsx': 'xls',
    '.zip': 'zip', '.tar': 'zip', '.gz': 'zip', '.rar': 'zip', '.7z': 'zip',
    '.py': 'py', '.rb': 'rb', '.php': 'php', '.java': 'java', '.c': 'c', '.cpp': 'cpp',
    '.sh': 'sh', '.bat': 'sh', '.ps1': 'sh',
    '.exe': 'exe', '.msi': 'exe', '.dmg': 'exe',
  };
  return icons[ext] || 'file';
}

function listDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    const result = [];

    for (const item of items) {
      try {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);
        const isDir = stats.isDirectory();
        result.push({
          name: item,
          isDirectory: isDir,
          size: isDir ? null : formatSize(stats.size),
          sizeBytes: isDir ? 0 : stats.size,
          modified: stats.mtime.toISOString(),
          created: stats.birthtime.toISOString(),
          icon: getFileIcon(item, isDir),
          ext: path.extname(item).toLowerCase(),
          hidden: item.startsWith('.'),
        });
      } catch (e) {
        // skip unreadable files
      }
    }

    // Sort: dirs first, then files, both alphabetically
    result.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return { success: true, items: result, path: dirPath };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function getDrives() {
  const platform = os.platform();
  const drives = [];
  const home = os.homedir();

  if (platform === 'win32') {
    // Standard user folders
    const userFolders = [
      { name: '🏠 Desktop',    sub: 'Desktop' },
      { name: '⬇ Downloads',  sub: 'Downloads' },
      { name: '📄 Dokumente',  sub: 'Documents' },
      { name: '🖼 Bilder',     sub: 'Pictures' },
      { name: '🎵 Musik',      sub: 'Music' },
      { name: '🎬 Videos',     sub: 'Videos' },
    ];
    for (const f of userFolders) {
      const p = path.join(home, f.sub);
      try { fs.accessSync(p); drives.push({ name: f.name, path: p, type: 'folder' }); } catch(e) {}
    }
    // All drive letters (C:, D:, USB sticks etc.)
    for (let i = 65; i <= 90; i++) {
      const drive = String.fromCharCode(i) + ':\\';
      try {
        fs.accessSync(drive);
        const label = drive === 'C:\\' ? `💽 C: (System)` : `🔌 ${drive} (Laufwerk)`;
        drives.push({ name: label, path: drive, type: 'drive' });
      } catch (e) {}
    }
  } else {
    drives.push({ name: '/ (Root)', path: '/', type: 'root' });
    drives.push({ name: '~ (Home)', path: home, type: 'home' });
    // Common user folders on Linux/Mac
    for (const sub of ['Downloads', 'Documents', 'Desktop', 'Pictures', 'Music', 'Videos']) {
      const p = path.join(home, sub);
      try { fs.accessSync(p); drives.push({ name: sub, path: p, type: 'folder' }); } catch(e) {}
    }
    for (const base of ['/media', '/mnt', '/Volumes']) {
      try {
        const items = fs.readdirSync(base);
        for (const item of items) {
          drives.push({ name: item, path: path.join(base, item), type: 'mount' });
        }
      } catch (e) {}
    }
  }
  return drives;
}

function readFileContent(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const textExts = ['.txt', '.md', '.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss',
      '.json', '.xml', '.yaml', '.yml', '.sh', '.bat', '.py', '.rb', '.php',
      '.java', '.c', '.cpp', '.h', '.cs', '.go', '.rs', '.log', '.env', '.gitignore',
      '.prettierrc', '.eslintrc', '.babelrc', '.toml', '.ini', '.cfg', '.conf'];

    if (stats.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File too large to preview (>5MB)' };
    }

    if (textExts.includes(ext) || ext === '') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        return { success: true, content, type: 'text', ext };
      } catch (e) {
        return { success: false, error: 'Cannot read file as text' };
      }
    }

    return { success: false, error: 'Binary file - no preview available', type: 'binary' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

const server = http.createServer((req, res) => {
  // Extract pathname safely from raw URL (before any query string)
  const rawUrl = req.url || '/';
  const qIdx = rawUrl.indexOf('?');
  const pathname = qIdx === -1 ? rawUrl : rawUrl.substring(0, qIdx);

  // Parse query params manually to avoid url.parse mangling encoded Windows paths
  const queryString = qIdx === -1 ? '' : rawUrl.substring(qIdx + 1);
  const query = {};
  for (const part of queryString.split('&')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = decodeURIComponent(part.substring(0, eqIdx));
    const val = decodeURIComponent(part.substring(eqIdx + 1));
    query[key] = val;
  }
  // Keep parsedUrl.query as alias for compatibility
  const parsedUrl = { query };

  // Log every request for debugging
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${pathname}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve static files
  if (pathname === '/' || pathname === '/index.html') {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // API: List directory
  if (pathname === '/api/list') {
    const dirPath = parsedUrl.query.path || os.homedir();
    const result = listDirectory(dirPath);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // API: Get drives
  if (pathname === '/api/drives') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ drives: getDrives() }));
    return;
  }

  // API: Read file
  if (pathname === '/api/read') {
    const filePath = parsedUrl.query.path;
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'No path provided' }));
      return;
    }
    const result = readFileContent(filePath);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // API: System info
  if (pathname === '/api/sysinfo') {
    const info = {
      platform: os.platform(),
      hostname: os.hostname(),
      username: os.userInfo().username,
      homedir: os.homedir(),
      totalMem: formatSize(os.totalmem()),
      freeMem: formatSize(os.freemem()),
      uptime: Math.floor(os.uptime() / 3600) + 'h ' + Math.floor((os.uptime() % 3600) / 60) + 'm',
      cpus: os.cpus().length,
      arch: os.arch(),
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info));
    return;
  }

  // API: Open file/folder with default application
  if (pathname === '/api/open') {
    const filePath = parsedUrl.query.path;
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'No path provided' }));
      return;
    }
    try {
      const { exec } = require('child_process');
      const platform = os.platform();
      let cmd;
      if (platform === 'win32') {
        // Use /c start to handle spaces and special chars; escape path
        const escaped = filePath.replace(/"/g, '\\"');
        cmd = `cmd /c start "" "${escaped}"`;
      } else if (platform === 'darwin') {
        cmd = `open "${filePath}"`;
      } else {
        cmd = `xdg-open "${filePath}"`;
      }
      exec(cmd, { shell: false }, (err) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: !err, error: err ? err.message : null }));
      });
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }



  // API: Read persistent storage
  if (pathname === '/api/storage/read') {
    const data = readStorage();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data }));
    return;
  }

  // API: Write persistent storage
  if (pathname === '/api/storage/write') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        // Merge with existing so partial writes don't wipe everything
        const current = readStorage();
        const merged = { ...current, ...incoming };
        const ok = writeStorage(merged);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: ok }));
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Create folder
  if (pathname === '/api/mkdir') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { dirPath } = JSON.parse(body);
        if (!dirPath) { res.writeHead(400); res.end(JSON.stringify({ success: false, error: 'Kein Pfad angegeben' })); return; }
        fs.mkdirSync(dirPath, { recursive: false });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Create file
  if (pathname === '/api/mkfile') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { filePath } = JSON.parse(body);
        if (!filePath) { res.writeHead(400); res.end(JSON.stringify({ success: false, error: 'Kein Pfad angegeben' })); return; }
        if (fs.existsSync(filePath)) { res.writeHead(200); res.end(JSON.stringify({ success: false, error: 'Datei existiert bereits' })); return; }
        fs.writeFileSync(filePath, '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Rename item
  if (pathname === '/api/rename') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { oldPath, newPath } = JSON.parse(body);
        fs.renameSync(oldPath, newPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Delete item
  if (pathname === '/api/delete') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { itemPath } = JSON.parse(body);
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) fs.rmSync(itemPath, { recursive: true, force: true });
        else fs.unlinkSync(itemPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Download file
  if (pathname === '/api/download') {
    const filePath = parsedUrl.query.path;
    try {
      const stats = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': getMimeType(ext),
        'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
        'Content-Length': stats.size,
      });
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      res.writeHead(404);
      res.end('File not found');
    }
    return;
  }


  // API: Move/copy file or folder (drag & drop)
  if (pathname === '/api/move') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { srcPath, destDir } = JSON.parse(body);
        const name = path.basename(srcPath);
        const destPath = path.join(destDir, name);
        if (srcPath === destPath) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Quelle und Ziel sind identisch' }));
          return;
        }
        if (fs.existsSync(destPath)) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: `"${name}" existiert bereits im Zielordner` }));
          return;
        }
        fs.renameSync(srcPath, destPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, destPath }));
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Copy file or folder
  if (pathname === '/api/copy') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { srcPath, destDir } = JSON.parse(body);
        const name = path.basename(srcPath);
        const destPath = path.join(destDir, name);
        if (fs.existsSync(destPath)) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: `"${name}" existiert bereits` }));
          return;
        }
        function copyRecursive(src, dest) {
          const stat = fs.statSync(src);
          if (stat.isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });
            for (const child of fs.readdirSync(src)) {
              copyRecursive(path.join(src, child), path.join(dest, child));
            }
          } else {
            fs.copyFileSync(src, dest);
          }
        }
        copyRecursive(srcPath, destPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, destPath }));
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Serve image for preview
  if (pathname === '/api/image') {
    const filePath = parsedUrl.query.path;
    const imgExts = ['.png','.jpg','.jpeg','.gif','.webp','.svg','.bmp','.ico'];
    try {
      const ext = path.extname(filePath).toLowerCase();
      if (!imgExts.includes(ext)) {
        res.writeHead(400); res.end('Not an image'); return;
      }
      const data = fs.readFileSync(filePath);
      const mime = {
        '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
        '.gif':'image/gif','.webp':'image/webp','.svg':'image/svg+xml',
        '.bmp':'image/bmp','.ico':'image/x-icon'
      }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
      res.end(data);
    } catch(e) {
      res.writeHead(404); res.end('Image not found');
    }
    return;
  }

  console.log(`[404] No route matched for: ${pathname}`);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: `Route nicht gefunden: ${pathname}` }));
});

server.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║     TERMINAL FILE MANAGER v1.0         ║`);
  console.log(`╠════════════════════════════════════════╣`);
  console.log(`║  Server running on:                    ║`);
  console.log(`║  http://localhost:${PORT}                 ║`);
  console.log(`║                                        ║`);
  console.log(`║  Press Ctrl+C to stop                  ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
});
