import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const must=['index.html','guide.html','about.html','privacy.html','assets/app.mjs','assets/tools.mjs','assets/site.css','config/offers.json','robots.txt','_headers'];
let errors=[];for(const file of must){if(!fs.existsSync(path.join(root,file)))errors.push(`Missing: ${file}`);}
for(const file of ['about.html','privacy.html']){const txt=fs.readFileSync(path.join(root,file),'utf8');if(txt.includes('【公開前に'))console.warn(`WARN ${file}: 公開前の運営者情報・ポリシー更新が必要です`);}
const offers=JSON.parse(fs.readFileSync(path.join(root,'config/offers.json'),'utf8'));
for(const offer of offers.offers||[]){if(offer.enabled&&(!offer.url.startsWith('https://')||offer.url.includes('example.com')))errors.push(`Invalid enabled offer: ${offer.name}`);}
for(const page of ['index.html','guide.html','about.html','privacy.html']){const html=fs.readFileSync(path.join(root,page),'utf8');if(!html.includes('<title>'))errors.push(`${page}: missing title`);}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('PASS: 必須ファイル、タイトル、広告URL設定を検査しました');
