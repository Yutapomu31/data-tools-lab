import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const out=path.join(root,'dist');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const rel of ['index.html','guide.html','about.html','privacy.html','robots.txt','_headers','assets/app.mjs','assets/tools.mjs','assets/site.css','config/offers.json']){const target=path.join(out,rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,rel),target);}
console.log('Build ready at dist/ (public files only)');
