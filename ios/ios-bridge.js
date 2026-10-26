/* iOS-only adapter: app state and document files are persisted by native, local storage. */
(function(){
 if(!window.webkit?.messageHandlers?.gutBegleitet)return;
 let serial=0;const pending=new Map();
 window.gutIOSReply=function(id,ok,value){const request=pending.get(id);if(!request)return;pending.delete(id);ok?request.resolve(value):request.reject(new Error(value||'Aktion fehlgeschlagen.'))};
 function request(action,payload={}){return new Promise((resolve,reject)=>{const id=String(++serial);pending.set(id,{resolve,reject});window.webkit.messageHandlers.gutBegleitet.postMessage({id,action,payload})})}
 async function encodedBlob(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('Datei konnte nicht gelesen werden.'));reader.readAsDataURL(blob)})}
 async function storeBlob(blob,metadata,operation='upload'){
  if(blob.size>20*1024*1024)throw Error('Datei ist größer als 20 MB.');
  const token=await request('startTransfer',{metadata,operation});
  try{const encoded=await encodedBlob(blob);for(let offset=0;offset<encoded.length;offset+=262144)await request('appendTransfer',{token,chunk:encoded.slice(offset,offset+262144)});return await request('finishTransfer',{token})}
  catch(error){await request('cancelTransfer',{token}).catch(()=>{});throw error}
 }
 window.documentStore=async function(mode,action){const operation=action({getAll:()=>({kind:'list'}),put:record=>({kind:'put',record}),delete:id=>({kind:'delete',id})});if(operation.kind==='list')return request('listDocuments');if(operation.kind==='delete')return request('deleteDocument',{id:operation.id});if(operation.kind==='put'){const {blob,...metadata}=operation.record;return storeBlob(blob,metadata)}throw Error('Unbekannte Ablageaktion.')};
 window.localDocumentUrl=function(item){return 'gutdoc://document/'+encodeURIComponent(item.id)};
 window.previewDocument=function(id){request('previewDocument',{id}).catch(error=>request('message',{text:error.message}))};
 let busy=false;
 async function exportFile(href,name,mime,mode){if(busy)return;busy=true;try{
  if(href.startsWith('gutdoc:')){await request('exportDocument',{id:decodeURIComponent(href.split('/').pop())});return}
  const blob=await (await fetch(href)).blob();await storeBlob(blob,{name:name||'Dokument.pdf',type:(mime||blob.type||'application/pdf').split(';')[0]},mode==='preview'?'preview':'export');
 }catch(error){await request('message',{text:error.message||'Export fehlgeschlagen.'})}finally{busy=false}}
 document.addEventListener('click',event=>{const a=event.target.closest&&event.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';
  if(a.hasAttribute('download')){event.preventDefault();event.stopImmediatePropagation();exportFile(a.href,a.getAttribute('download'),'','export');return}
  if(href.startsWith('blob:')){event.preventDefault();event.stopImmediatePropagation();exportFile(a.href,'Vorsorgedokument.pdf','application/pdf','preview');return}
  if(/^(https?:|tel:|mailto:)/i.test(href)){event.preventDefault();event.stopImmediatePropagation();request('openExternal',{url:a.href})}
 },true);
 window.exportPlanner=function(id){const e=plannerItems().find(item=>item.id===id);if(e)request('calendar',{title:e.title,date:e.date,lead:e.lead,note:e.note||''}).catch(error=>request('message',{text:error.message}))};
 window.gutIOSSmoke=async function(){
  if(Object.keys(conditions).length!==30||!document.querySelector('#main').textContent.trim())throw Error('Inhalte nicht geladen.');
  for(const page of ['home','wissen','weg','hilfe','aufgaben','kontakte','verlauf','lexikon','dokumente']){location.hash='#'+page;render();if(document.querySelector('#main').textContent.includes('undefined'))throw Error('Ansicht: '+page)}
  window.GutBegleitetIOSStorage.setItem('weiter-demo',JSON.stringify({...state,iosSmokePersistence:true}));
  await request('deleteDocument',{id:'smoke-document'});
  const id='smoke-document',blob=new Blob([new Uint8Array([1,2,3])],{type:'image/png'});
  await storeBlob(blob,{id,name:'Smoke.png',type:'image/png',size:3,created:Date.now(),disease:'schlaganfall',diseaseName:'Schlaganfall'});
  const files=await request('listDocuments');if(!files.some(file=>file.id===id))throw Error('Native Ablage fehlgeschlagen.');await request('deleteDocument',{id});
  if(!officialDocumentTemplates.every(t=>t.data.startsWith('data:application/pdf;base64,JVBER')))throw Error('PDF-Vorlagen fehlen.');
  location.hash='#home';render();return {ok:true,diseases:Object.keys(conditions).length,documents:'native-local',pages:9};
 };
})();
