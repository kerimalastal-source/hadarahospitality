// Generates one technical-sheet PDF per product into public/technical-sheets.
// Run with `npm run generate:technical-sheets`. Runs automatically before
// `dev`/`build`. Output is gitignored — rebuilt on every install/deploy.

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS, CATEGORIES, type Product } from '../src/data/products.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public', 'technical-sheets');
mkdirSync(OUT, { recursive: true });

const ascii = (value = '') =>
  String(value)
    .replace(/[–—]/g, '-')
    .replace(/[★]/g, 'star')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const pdfEsc = (s: string) => ascii(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
const wrap = (text: string, max = 78) => {
  const words = ascii(text).split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
};

function makePdf(product: Product): Buffer {
  const category = CATEGORIES[product.category].label;
  const lines: string[] = [];
  const text = (x: number, y: number, size: number, value: string, bold = false) =>
    lines.push(`BT /F${bold ? 2 : 1} ${size} Tf ${x} ${y} Td (${pdfEsc(value)}) Tj ET`);
  const rule = (y: number) => lines.push(`0.78 0.62 0.28 RG 48 ${y} m 547 ${y} l S`);
  lines.push('0.12 0.17 0.23 rg 0 742 595 100 re f');
  text(48, 802, 22, 'HADARA', true);
  text(48, 783, 9, 'HOSPITALITY  |  ISTANBUL, TURKIYE');
  text(48, 714, 9, 'TECHNICAL SHEET', true);
  text(48, 680, 22, product.name, true);
  text(48, 657, 11, category);
  rule(638);
  let y = 610;
  const field = (label: string, value: string) => {
    text(48, y, 9, label.toUpperCase(), true);
    y -= 17;
    for (const l of wrap(value, 82)) {
      text(48, y, 10, l);
      y -= 14;
    }
    y -= 10;
  };
  field('Overview', product.overview);
  field('Material', product.material);
  field(product.specLabel, product.specValues.join(' / '));
  field('Suitable For', product.suitableFor);
  field('Customization', product.customization.join(' | '));
  text(48, y, 9, 'KEY FEATURES', true);
  y -= 19;
  for (const f of product.features) {
    for (const l of wrap(`- ${f}`, 80)) {
      text(55, y, 10, l);
      y -= 14;
    }
  }
  y -= 8;
  rule(y);
  y -= 24;
  text(48, y, 9, 'PRODUCTION & SUPPLY', true);
  y -= 18;
  for (const l of wrap(
    'Supplied through trusted Turkish manufacturing partners with hospitality-focused production standards. Customized production, private labeling and bulk supply solutions are available upon request.',
    82,
  )) {
    text(48, y, 9, l);
    y -= 13;
  }
  text(48, 70, 9, 'HADARA Hospitality | partnerships@hadarahospitality.com | hadarahospitality.com');
  text(48, 52, 8, 'Specifications are project-dependent and subject to final sample, production and commercial approval.');
  const stream = lines.join('\n');
  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objects[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>';
  objects[4] = `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`;
  objects[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (let i = 1; i <= 6; i++) {
    offsets[i] = Buffer.byteLength(pdf);
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += 'xref\n0 7\n0000000000 65535 f \n';
  for (let i = 1; i <= 6; i++) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'binary');
}

for (const product of PRODUCTS) writeFileSync(resolve(OUT, `${product.slug}.pdf`), makePdf(product));
console.log(`Generated ${PRODUCTS.length} technical sheet PDFs in /public/technical-sheets`);
