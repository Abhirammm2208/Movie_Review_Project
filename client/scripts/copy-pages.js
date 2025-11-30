// Copy extra HTML entry pages into dist after Vite build
// Ensures login.html, register.html, add-review.html are available in production.
import { copyFile, mkdir, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';

const pages = ['login.html', 'register.html', 'add-review.html'];
const distDir = path.resolve('dist');

async function ensureDist(){
  try { await access(distDir, constants.F_OK); } catch { await mkdir(distDir, {recursive:true}); }
}

async function run(){
  await ensureDist();
  for(const page of pages){
    const src = path.resolve(page);
    const dest = path.join(distDir, page);
    try {
      await copyFile(src, dest);
      console.log(`[copy-pages] Copied ${page}`);
    } catch (e){
      console.warn(`[copy-pages] Failed to copy ${page}:`, e.message);
    }
  }
}

run();
