/**
 * Generates all required PWA icon sizes from the SVG sources.
 * Run with: npm run icons
 */
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public', 'icons')

mkdirSync(publicDir, { recursive: true })

const regularSvg   = readFileSync(join(publicDir, 'icon.svg'))
const maskableSvg  = readFileSync(join(publicDir, 'icon-maskable.svg'))

// Standard sizes required by Chrome + Apple
const standardSizes = [72, 96, 128, 144, 152, 192, 384, 512]

console.log('Generating standard icons…')
for (const size of standardSizes) {
  const outPath = join(publicDir, `icon-${size}.png`)
  await sharp(regularSvg, { density: 300 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outPath)
  console.log(`  ✓ icon-${size}.png`)
}

console.log('Generating maskable icons…')
for (const size of [192, 512]) {
  const outPath = join(publicDir, `icon-${size}-maskable.png`)
  await sharp(maskableSvg, { density: 300 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outPath)
  console.log(`  ✓ icon-${size}-maskable.png`)
}

// Apple touch icon (180×180, no transparency, white bg)
const appleOut = join(publicDir, 'apple-touch-icon.png')
await sharp(regularSvg, { density: 300 })
  .resize(180, 180)
  .flatten({ background: '#ffffff' })
  .png({ compressionLevel: 9 })
  .toFile(appleOut)
console.log('  ✓ apple-touch-icon.png')

// Favicon (32×32)
const faviconOut = join(__dirname, '..', 'public', 'favicon.png')
await sharp(regularSvg, { density: 300 })
  .resize(32, 32)
  .png({ compressionLevel: 9 })
  .toFile(faviconOut)
console.log('  ✓ favicon.png (public/favicon.png)')

console.log('\nAll icons generated successfully!')
