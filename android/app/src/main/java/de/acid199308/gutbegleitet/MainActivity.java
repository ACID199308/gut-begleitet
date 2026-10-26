package de.acid199308.gutbegleitet;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class MainActivity extends Activity {
    static final String HOST="appassets.androidplatform.net";
    static final String START="https://"+HOST+"/assets/index.html";
    static final int FILE_PICK=10, CAMERA_PICK=11, EXPORT_PICK=12;
    WebView web;
    ValueCallback<Uri[]> fileCallback;
    Uri cameraUri;
    File cameraFile;
    Export pendingExport;
    final Map<String,Export> exports=new HashMap<>();
    static class Export {File file;String name,mime,mode;long bytes;Export(File f,String n,String m,String a){file=f;name=n;mime=m;mode=a;}}
    @Override public void onCreate(Bundle state){
        super.onCreate(state);
        web=new WebView(this);web.setBackgroundColor(Color.rgb(247,248,243));
        web.setOnApplyWindowInsetsListener((v,insets)->{v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});
        setContentView(web);
        WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(false);settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setTextZoom(Math.round(getResources().getConfiguration().fontScale*100));
        settings.setSupportMultipleWindows(false);settings.setJavaScriptCanOpenWindowsAutomatically(false);
        CookieManager.getInstance().setAcceptCookie(false);
        web.addJavascriptInterface(new LocalBridge(),"GutBegleitetAndroid");
        web.setWebViewClient(new WebViewClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();
                if("https".equals(uri.getScheme())&&HOST.equals(uri.getHost())){
                    String path=uri.getPath();
                    if(path==null||!path.startsWith("/assets/")||path.contains("..")||path.indexOf('\\')>=0)return blocked();
                    try{String name=path.substring(8);String type=name.endsWith(".html")?"text/html":name.endsWith(".js")?"text/javascript":name.endsWith(".css")?"text/css":name.endsWith(".pdf")?"application/pdf":"application/octet-stream";
                        Map<String,String> headers=new HashMap<>();headers.put("Cache-Control","no-cache");headers.put("X-Content-Type-Options","nosniff");
                        headers.put("Content-Security-Policy","default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' data: blob:; frame-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'");
                        return new WebResourceResponse(type,"UTF-8",200,"OK",headers,getAssets().open(name));
                    }catch(IOException e){return blocked();}
                }
                return blocked();
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest req){Uri u=req.getUrl();if("https".equals(u.getScheme())&&HOST.equals(u.getHost())&&u.getPath()!=null&&u.getPath().startsWith("/assets/"))return false;if(req.isForMainFrame())openExternal(u);return true;}
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
                if(fileCallback!=null)fileCallback.onReceiveValue(null);fileCallback=callback;
                try{
                    if(params.isCaptureEnabled()){
                        File folder=new File(getCacheDir(),"shared/camera");folder.mkdirs();cameraFile=new File(folder,UUID.randomUUID()+".jpg");cameraFile.createNewFile();
                        cameraUri=Uri.parse("content://"+LocalFileProvider.AUTHORITY+"/camera/"+cameraFile.getName());
                        Intent intent=new Intent(MediaStore.ACTION_IMAGE_CAPTURE);intent.putExtra(MediaStore.EXTRA_OUTPUT,cameraUri);intent.setClipData(ClipData.newRawUri("Dokument fotografieren",cameraUri));intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION|Intent.FLAG_GRANT_READ_URI_PERMISSION);startActivityForResult(intent,CAMERA_PICK);
                    }else{
                        Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT);intent.addCategory(Intent.CATEGORY_OPENABLE);intent.setType("*/*");intent.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{"application/pdf","image/*"});intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,params.getMode()==FileChooserParams.MODE_OPEN_MULTIPLE);startActivityForResult(intent,FILE_PICK);
                    }
                }catch(Exception e){notifyUser("Dateiauswahl oder Kamera ist nicht verfügbar.");fileCallback.onReceiveValue(null);fileCallback=null;}
                return true;
            }
        });
        web.setDownloadListener((url,agent,disposition,mime,length)->notifyUser("Bitte die Download-Schaltfläche innerhalb der App verwenden."));
        cleanupCache();web.loadUrl(START);
    }
    WebResourceResponse blocked(){return new WebResourceResponse("text/plain","UTF-8",403,"Forbidden",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
    void notifyUser(String text){runOnUiThread(()->Toast.makeText(this,text,Toast.LENGTH_LONG).show());}
    void openExternal(Uri uri){String scheme=uri.getScheme();if(!Arrays.asList("https","http","tel","mailto").contains(scheme))return;try{startActivity(new Intent("tel".equals(scheme)?Intent.ACTION_DIAL:Intent.ACTION_VIEW,uri));}catch(Exception e){notifyUser("Keine passende App zum Öffnen vorhanden.");}}
    void cleanupCache(){for(String dir:new String[]{"exports","camera"}){File folder=new File(getCacheDir(),"shared/"+dir);File[] files=folder.listFiles();if(files!=null)for(File f:files)if(f.lastModified()<System.currentTimeMillis()-86400000L)f.delete();}}
    @Override public void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);
        if(request==FILE_PICK||request==CAMERA_PICK){
            if(fileCallback==null)return;Uri[] values=null;
            if(result==RESULT_OK){if(request==CAMERA_PICK&&cameraUri!=null&&cameraFile!=null&&cameraFile.length()>0)values=new Uri[]{cameraUri};else if(data!=null){ClipData clip=data.getClipData();if(clip!=null){values=new Uri[clip.getItemCount()];for(int i=0;i<values.length;i++)values[i]=clip.getItemAt(i).getUri();}else if(data.getData()!=null)values=new Uri[]{data.getData()};}}
            fileCallback.onReceiveValue(values);fileCallback=null;cameraUri=null;cameraFile=null;
        }
        if(request==EXPORT_PICK){final Export item=pendingExport;pendingExport=null;if(item==null)return;if(result==RESULT_OK&&data!=null&&data.getData()!=null){final Uri target=data.getData();new Thread(()->{try(InputStream input=new FileInputStream(item.file);OutputStream output=getContentResolver().openOutputStream(target,"w")){if(output==null)throw new IOException();byte[] buffer=new byte[65536];int n;while((n=input.read(buffer))!=-1)output.write(buffer,0,n);notifyUser("Datei gespeichert.");}catch(Exception e){notifyUser("Datei konnte nicht gespeichert werden.");}finally{item.file.delete();}}).start();}else item.file.delete();}
    }
    public class LocalBridge {
        @JavascriptInterface public synchronized String beginExport(String name,String mime,String mode){
            if(exports.size()>=2)return "";if(!"download".equals(mode)&&!"preview".equals(mode))return "";
            if(!("application/pdf".equals(mime)||"text/calendar".equals(mime)||mime.startsWith("image/")))return "";
            try {String clean=name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]","_");if(clean.length()>120)clean=clean.substring(clean.length()-120);if(clean.isEmpty())clean="Dokument";
                File folder=new File(getCacheDir(),"shared/exports");folder.mkdirs();String token=UUID.randomUUID().toString();File file=new File(folder,token+"-"+clean);file.createNewFile();exports.put(token,new Export(file,clean,mime,mode));return token;
            }catch(Exception e){return "";}
        }
        @JavascriptInterface public synchronized boolean appendExport(String token,String base64){Export item=exports.get(token);if(item==null||base64.length()>262144)return false;try{byte[] bytes=android.util.Base64.decode(base64,android.util.Base64.DEFAULT);if(item.bytes+bytes.length>20L*1024*1024)return false;try(OutputStream out=new FileOutputStream(item.file,true)){out.write(bytes);}item.bytes+=bytes.length;return true;}catch(Exception e){return false;}}
        @JavascriptInterface public synchronized void cancelExport(String token){Export item=exports.remove(token);if(item!=null)item.file.delete();}
        @JavascriptInterface public synchronized boolean finishExport(String token){Export item=exports.remove(token);if(item==null||item.bytes==0)return false;runOnUiThread(()->{
            if("preview".equals(item.mode)){Uri uri=new Uri.Builder().scheme("content").authority(LocalFileProvider.AUTHORITY).appendPath("exports").appendPath(item.file.getName()).build();Intent intent=new Intent(MainActivity.this,"application/pdf".equals(item.mime)?PdfActivity.class:ImageActivity.class);intent.setData(uri);intent.putExtra("title",item.name);startActivity(intent);}
            else{if(pendingExport!=null){item.file.delete();notifyUser("Bitte zuerst den offenen Speicherdialog schließen.");return;}pendingExport=item;Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);intent.addCategory(Intent.CATEGORY_OPENABLE);intent.setType(item.mime);intent.putExtra(Intent.EXTRA_TITLE,item.name);try{startActivityForResult(intent,EXPORT_PICK);}catch(Exception e){pendingExport=null;item.file.delete();notifyUser("Speichern ist auf diesem Gerät nicht verfügbar.");}}
        });return true;}
        @JavascriptInterface public void message(String text){notifyUser(text.length()>200?text.substring(0,200):text);}
        @JavascriptInterface public void openUrl(String url){Uri uri=Uri.parse(url);runOnUiThread(()->openExternal(uri));}
    }
    @Override public void onBackPressed(){web.evaluateJavascript("(()=>{const d=document.querySelector('dialog[open]');if(d){d.close();return true}return false})()",value->{if("true".equals(value))return;if(web.canGoBack())web.goBack();else finish();});}
    @Override protected void onDestroy(){if(fileCallback!=null)fileCallback.onReceiveValue(null);web.removeJavascriptInterface("GutBegleitetAndroid");web.destroy();super.onDestroy();}
}
