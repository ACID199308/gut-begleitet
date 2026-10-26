import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const windows=process.platform==='win32';
const sdk=process.env.ANDROID_SDK_ROOT||process.env.ANDROID_HOME;
const javaHome=process.env.JAVA_HOME;
if(!sdk||!javaHome)throw Error('JAVA_HOME (JDK 17) und ANDROID_SDK_ROOT setzen. Siehe README.');
const java=path.join(javaHome,'bin',windows?'java.exe':'java');
const javac=path.join(javaHome,'bin',windows?'javac.exe':'javac');
const jar=path.join(javaHome,'bin',windows?'jar.exe':'jar');
const tools=path.join(sdk,'build-tools','35.0.0');
const androidJar=path.join(sdk,'platforms','android-35','android.jar');
const aapt=path.join(tools,windows?'aapt2.exe':'aapt2');
const zipalign=path.join(tools,windows?'zipalign.exe':'zipalign');
const build=path.join(root,'build'),src=path.join(root,'android','app','src','main');
for(const name of ['classes','dex','generated','tmp'])fs.mkdirSync(path.join(build,name),{recursive:true});
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
function run(exe,args){const tmp='-Djava.io.tmpdir='+path.join(build,'tmp');if(exe===jar)args=['-J'+tmp,...args];else if(exe===java)args=[tmp,...args];execFileSync(exe,args,{stdio:'inherit',cwd:root})}
function allFiles(dir,ext){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allFiles(path.join(dir,e.name),ext):e.name.endsWith(ext)?[path.join(dir,e.name)]:[])}
const assets=path.join(src,'assets');fs.mkdirSync(assets,{recursive:true});
const web=path.join(root,'web','index.html');
let html=fs.readFileSync(web,'utf8');
html=html.replaceAll('in diesem Browser auf diesem Gerät','in dieser App auf diesem Smartphone').replaceAll('in diesem Browser','in dieser App').replaceAll('diesem Browser','dieser App').replaceAll('beim Löschen der Browserdaten','beim Löschen der App-Daten').replaceAll('Beim Löschen der Browserdaten','Beim Löschen der App-Daten').replaceAll('Speicherplatz oder Browserberechtigung','Speicherplatz oder App-Berechtigung').replaceAll('Kein Upload auf die Synology und keine Synchronisierung.','Kein Server und keine Synchronisierung.').replaceAll('Die Kameraauswahl hängt vom Smartphone und Browser ab.','Die Kamera verwendet die Kamera-App deines Smartphones.');
const bridge=fs.readFileSync(path.join(root,'android','android-bridge.js'),'utf8');
html=html.replace('</body>','<script>'+bridge+'</script></body>');
fs.writeFileSync(path.join(assets,'index.html'),html);
run(aapt,['compile','--dir',path.join(src,'res'),'-o',path.join(build,'resources.zip')]);
run(aapt,['link','--auto-add-overlay','-o',path.join(build,'base.apk'),'-I',androidJar,'--manifest',path.join(src,'AndroidManifest.xml'),'--java',path.join(build,'generated'),'-R',path.join(build,'resources.zip'),'-A',assets]);
const javaFiles=[...allFiles(path.join(src,'java'),'.java'),...allFiles(path.join(build,'generated'),'.java')];
for(const file of javaFiles){const content=fs.readFileSync(file,'utf8');if(content.startsWith('\uFEFF'))fs.writeFileSync(file,content.slice(1))}
fs.writeFileSync(path.join(build,'sources.txt'),javaFiles.map(f=>'"'+f.replaceAll('\\','/')+'"').join('\n'));
run(javac,['-encoding','UTF-8','--release','8','-classpath',androidJar,'-d',path.join(build,'classes'),'@'+path.join(build,'sources.txt')]);
run(jar,['cf',path.join(build,'classes.jar'),'-C',path.join(build,'classes'),'.']);
run(java,['-cp',path.join(tools,'lib','d8.jar'),'com.android.tools.r8.D8','--release','--min-api','26','--lib',androidJar,'--output',path.join(build,'dex'),path.join(build,'classes.jar')]);
run(jar,['uf',path.join(build,'base.apk'),'-C',path.join(build,'dex'),'classes.dex']);
run(zipalign,['-f','-p','4',path.join(build,'base.apk'),path.join(build,'aligned.apk')]);
const store=process.env.GUT_KEYSTORE;
if(!store||!process.env.GUT_KEYSTORE_PASSWORD)throw Error('Zum Signieren GUT_KEYSTORE und GUT_KEYSTORE_PASSWORD setzen. Private Schlüssel nie veröffentlichen.');
const output=path.join(root,'dist','gut-begleitet-1.0.0.apk');
run(java,['-jar',path.join(tools,'lib','apksigner.jar'),'sign','--ks',store,'--ks-key-alias','gutbegleitet','--ks-pass','env:GUT_KEYSTORE_PASSWORD','--key-pass','env:GUT_KEYSTORE_PASSWORD','--out',output,path.join(build,'aligned.apk')]);
run(java,['-jar',path.join(tools,'lib','apksigner.jar'),'verify','--verbose',output]);
console.log('Installierbare APK: '+output);


