import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, dirname, basename, extname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const assetsDir = join(__dirname, '../src/assets')

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i
const SKIP_DIRS = new Set(['optimized', 'originals', '.optimized', 'node_modules'])

const WEDDING_THUMB = { maxWidth: 480, quality: 82 }
const WEDDING_FULL = { maxWidth: 1920, quality: 85 }
const GENERAL = { maxWidth: 1920, quality: 85 }

async function needsUpdate(src, dest) {
  try {
    const [srcStat, destStat] = await Promise.all([stat(src), stat(dest)])
    return srcStat.mtimeMs > destStat.mtimeMs
  } catch {
    return true
  }
}

async function toWebp(src, dest, { maxWidth, quality }) {
  await mkdir(dirname(dest), { recursive: true })
  await sharp(src)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(dest)
}

async function optimizeWeddingPhotos() {
  const srcDir = join(assetsDir, 'wedding-photos')
  const outDir = join(srcDir, 'optimized')

  let entries
  try {
    entries = await readdir(srcDir, { withFileTypes: true })
  } catch {
    return { count: 0 }
  }

  let count = 0
  for (const entry of entries) {
    if (!entry.isFile() || !IMAGE_EXT.test(entry.name)) continue

    const src = join(srcDir, entry.name)
    const base = basename(entry.name, extname(entry.name))
    const thumbOut = join(outDir, `${base}-thumb.webp`)
    const fullOut = join(outDir, `${base}-full.webp`)

    if (await needsUpdate(src, thumbOut)) {
      await toWebp(src, thumbOut, WEDDING_THUMB)
      console.log(`  thumb: ${relative(assetsDir, thumbOut)}`)
    }
    if (await needsUpdate(src, fullOut)) {
      await toWebp(src, fullOut, WEDDING_FULL)
      console.log(`  full:  ${relative(assetsDir, fullOut)}`)
    }
    count++
  }
  return { count }
}

async function optimizeGeneralAssets() {
  const folders = ['splash', 'cover', 'about', 'sections', 'location']
  let count = 0

  for (const folder of folders) {
    const srcDir = join(assetsDir, folder)
    let entries
    try {
      entries = await readdir(srcDir, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      if (!entry.isFile() || !IMAGE_EXT.test(entry.name)) continue

      const src = join(srcDir, entry.name)
      const base = basename(entry.name, extname(entry.name))
      const dest = join(assetsDir, '.optimized', folder, `${base}.webp`)

      if (await needsUpdate(src, dest)) {
        await toWebp(src, dest, GENERAL)
        console.log(`  asset: ${relative(assetsDir, dest)}`)
        count++
      }
    }
  }
  return { count }
}

async function main() {
  console.log('Optimizing wedding gallery photos...')
  const wedding = await optimizeWeddingPhotos()
  console.log(`  ${wedding.count} source photo(s) processed`)

  console.log('Optimizing static assets (splash, cover, about, sections, location)...')
  const general = await optimizeGeneralAssets()
  console.log(`  ${general.count} asset(s) updated`)

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
