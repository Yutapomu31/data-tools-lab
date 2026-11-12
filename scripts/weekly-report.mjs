/** Optional uptime check; does not claim visitors or earnings. */
import fs from 'node:fs';
const site=process.env.SITE_URL||'';const t=new Date();let status='未設定',details='SITE_URL が未設定です。公開後にリポジトリの変数に設定してください。';
if(site){try{const url=new URL(site);if(url.protocol!=='https:')throw Error('HTTPSのみ対応');const response=await fetch(url,{signal:AbortSignal.timeout(12000)});status=response.ok?'OK':'ERROR';details=`HTTP ${response.status} / ${url.origin}`;}catch(e){status='ERROR';details=e.message;}}
const report=`# 週次運用レポート\n\n- 検査日時（UTC）: ${t.toISOString()}\n- サイト稼働状況: ${status}\n- 判定内容: ${details}\n- 売上: 未連携（ASPの管理画面で確認）\n- 訪問数: 未連携（アクセス解析の管理画面で確認）\n\n## 運用チェック\n- [ ] 広告・比較情報の正確性を確認\n- [ ] 運営者情報・プライバシー表記を確認\n- [ ] 広告の提携規約・成果条件を確認\n`;
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/latest.md',report,'utf8');console.log(report);if(status==='ERROR')process.exitCode=1;
