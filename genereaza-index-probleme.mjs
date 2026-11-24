import fs from 'node:fs';
import path from 'node:path';

const probDir = path.resolve('src/pages/probleme');
const outJson = path.resolve('src/data/probleme-generate.json');

const files = fs.existsSync(probDir)
  ? fs
      .readdirSync(probDir)
      .filter((f) => /^pbinfo-\d+.*\.astro$/i.test(f))
      .sort((a, b) => Number(a.match(/^pbinfo-(\d+)/i)?.[1] || 0) - Number(b.match(/^pbinfo-(\d+)/i)?.[1] || 0))
  : [];

const items = files.map((file) => {
  const fullPath = path.join(probDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const numMatch = file.match(/^pbinfo-(\d+)/i);
  const h1Match = content.match(/<h1>([\s\S]*?)<\/h1>/i);
  const slug = file.replace(/\.astro$/i, '');

  return {
    numar: numMatch ? numMatch[1] : '',
    titlu: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : slug,
    fisier: file,
    ruta: `/probleme/${slug}`,
  };
});

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(items, null, 2), 'utf8');
console.log(`Indexat ${items.length} fisiere existente in ${outJson}`);