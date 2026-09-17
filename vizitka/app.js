const contact={
  firstName:'Petr',
  lastName:'Grygárek',
  organization:'Olomócké Fachman',
  title:'Hodinový řemeslník pro Olomouc a okolí',
  phone:'+420722237203',
  email:'fachmanol@email.cz',
  url:'https://www.olomockefachman.cz/',
  note:'Dům · Byt · Zahrada | IČO: 04948467',
  facebook:'https://www.facebook.com/olomockefachman/',
  instagram:'https://www.instagram.com/olomocke.fachman/'
};

function esc(v){return String(v).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function makeVCard(){
  return [
    'BEGIN:VCARD','VERSION:3.0',
    `N:${esc(contact.lastName)};${esc(contact.firstName)};;;`,
    `FN:${esc(contact.firstName+' '+contact.lastName)}`,
    `ORG:${esc(contact.organization)}`,
    `TITLE:${esc(contact.title)}`,
    `TEL;TYPE=CELL:${contact.phone}`,
    `EMAIL;TYPE=INTERNET:${contact.email}`,
    `URL:${contact.url}`,
    `NOTE:${esc(contact.note)}`,
    'END:VCARD'
  ].join('\r\n')+'\r\n';
}

document.getElementById('saveContact').addEventListener('click',()=>{
  const blob=new Blob([makeVCard()],{type:'text/vcard;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='Petr-Grygarek-Olomocke-Fachman.vcf';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}
