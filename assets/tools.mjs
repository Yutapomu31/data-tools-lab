/** Browser-first data tools. No network calls or dependencies. */
export function parseDelimited(input, delimiter=',') {
  if (!input.trim()) return [];
  const out=[]; let row=[],field='',quoted=false,atFieldStart=true;
  for(let i=0;i<input.length;i++) {
    const c=input[i];
    if(quoted){if(c==='"' && input[i+1]==='"'){field+='"';i++;} else if(c==='"'){quoted=false;}else{field+=c;}continue;}
    if(c==='"'){if(!atFieldStart)throw Error('引用符はセルの先頭に指定してください');quoted=true;atFieldStart=false;}
    else if(c===delimiter){row.push(field);field='';atFieldStart=true;}
    else if(c==='\r'||c==='\n'){if(c==='\r'&&input[i+1]==='\n')i++;row.push(field);out.push(row);row=[];field='';atFieldStart=true;}
    else {field+=c;atFieldStart=false;}
  }
  if(quoted)throw Error('閉じられていない引用符があります');
  if(field!==''||row.length) {row.push(field);out.push(row);}
  else if(out.length && out.at(-1).length===1 && out.at(-1)[0]==='')out.pop();
  return out;
}
export function csvToJson(input,delimiter=',') {
  const rows=parseDelimited(input.replace(/^\ufeff/,''),delimiter);
  if(rows.length<1)throw Error('CSVを入力してください');
  const headers=rows.shift();
  if(headers.some(k=>!k)||new Set(headers).size!==headers.length)throw Error('空欄または重複した列名があります');
  const data=rows.filter(r=>!r.every(x=>x==='')).map((r,i)=>{if(r.length!==headers.length)throw Error(`データ${i+1}行目の列数が一致しません`);return Object.fromEntries(headers.map((h,j)=>[h,r[j]]));});
  return JSON.stringify(data,null,2);
}
function csvCell(value) {const s=value==null?'':typeof value==='object'?JSON.stringify(value):String(value);return /[",\r\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;}
export function jsonToCsv(input,delimiter=',') {
  const data=JSON.parse(input);
  if(!Array.isArray(data)||data.some(x=>x===null||typeof x!=='object'||Array.isArray(x)))throw Error('JSONオブジェクトの配列を入力してください');
  if(!data.length)return '';
  const keys=[...new Set(data.flatMap(Object.keys))];
  return [keys.map(csvCell).join(delimiter),...data.map(item=>keys.map(k=>csvCell(item[k])).join(delimiter))].join('\r\n');
}
export function formatJson(input,indent=2) {return JSON.stringify(JSON.parse(input),null,indent);}
export function minifyJson(input) {return JSON.stringify(JSON.parse(input));}
export function encodeUrl(input) {return encodeURIComponent(input);}
export function decodeUrl(input) {try{return decodeURIComponent(input);}catch{throw Error('URLエンコード文字列が不正です');}}
export function textStats(input) {return {characters:[...input].length,lines:input===''?0:input.split(/\r\n|\r|\n/).length,bytes:new TextEncoder().encode(input).length};}
