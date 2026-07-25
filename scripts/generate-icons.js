/* eslint-disable @typescript-eslint/no-require-imports */  
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/brand/quality-accreditation-logo.jpg');
const outDir = path.join(__dirname, '../public/brand');

async function generate() {
  const input = fs.readFileSync(inputPath);
  
  await sharp(input).resize(32, 32).png().toFile(path.join(outDir, 'favicon-32.png'));
  await sharp(input).resize(192, 192).png().toFile(path.join(outDir, 'favicon-192.png'));
  await sharp(input).resize(512, 512).png().toFile(path.join(outDir, 'favicon-512.png'));
  await sharp(input).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));
  
  // also make a png version of the main logo for use
  await sharp(input).png().toFile(path.join(outDir, 'quality-accreditation-logo.png'));
  
  console.log('Icons generated successfully');
}

generate().catch(console.error);
