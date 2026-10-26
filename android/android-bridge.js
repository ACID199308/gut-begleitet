/* Android-only adapter. All reading and transfers remain inside the installed application. */
(function(){
 if(!window.GutBegleitetAndroid)return;
 const bridge=window.GutBegleitetAndroid;
 let busy=false;
 async function transfer(url,name,mime,mode){
  if(busy){bridge.message('Bitte den laufenden Export abwarten.');return}
  busy=true;let token='';
  try{
   const response=await fetch(url);const blob=await response.blob();
   if(blob.size>20*1024*1024)throw Error('Datei ist größer als 20 MB.');
   const encoded=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob)});
   const type=(mime||blob.type||'application/pdf').split(';')[0];
   token=bridge.beginExport(name||'Dokument.pdf',type,mode||'download');if(!token)throw Error('Export konnte nicht gestartet werden.');
   for(let pos=0;pos<encoded.length;pos+=262144)if(!bridge.appendExport(token,encoded.slice(pos,pos+262144)))throw Error('Datei konnte nicht übertragen werden.');
   if(!bridge.finishExport(token))throw Error('Datei konnte nicht geöffnet werden.');
  }catch(error){if(token)bridge.cancelExport(token);bridge.message(error.message||'Export fehlgeschlagen.')}finally{busy=false}
 }
 document.addEventListener('click',event=>{const a=event.target.closest&&event.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';
  if(a.hasAttribute('download')){event.preventDefault();event.stopImmediatePropagation();transfer(a.href,a.getAttribute('download'),'','download');return}
  if(href.startsWith('blob:')){event.preventDefault();event.stopImmediatePropagation();transfer(a.href,'Vorsorgedokument.pdf','application/pdf','preview');return}
  if(/^(https?:|tel:|mailto:)/i.test(href)){event.preventDefault();event.stopImmediatePropagation();bridge.openUrl(a.href)}
 },true);
 window.previewDocument=function(id){const item=documentItems.find(x=>x.id===id);if(item)transfer(localDocumentUrl(item),item.name,item.type,'preview')};
 // A fresh Activity opening is a new app start; internal page changes do not create new Activities.
 window.addEventListener('pageshow',()=>{});
})();
