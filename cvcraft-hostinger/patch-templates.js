const fs = require('fs');
const path = require('path');
const dir = 'd:/AI/cv 1/cvcraft-hostinger/src/lib/pdf/templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(
    /export function (\w+Template)\(\{ cv \}: \{ cv: CV \}\) \{/,
    'export function $1({ cv, isPremium = false }: { cv: CV; isPremium?: boolean }) {'
  );
  
  const watermark = `\n      {!isPremium && <Text style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "#9ca3af" }}>Created with CvCRAFT.uk</Text>}\n    </Page>`;
  
  if (!content.includes('Created with CvCRAFT.uk')) {
    content = content.replace(/<\/Page>/, watermark);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + file);
}
