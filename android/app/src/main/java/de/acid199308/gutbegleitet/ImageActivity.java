package de.acid199308.gutbegleitet;
import android.app.Activity;
import android.graphics.*;
import android.os.Bundle;
import android.widget.*;
import java.io.InputStream;
public class ImageActivity extends Activity {
    Bitmap image;
    @Override public void onCreate(Bundle state){super.onCreate(state);LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setPadding(16,32,16,16);TextView title=new TextView(this);title.setText(getIntent().getStringExtra("title"));title.setTextSize(18);root.addView(title);ImageView view=new ImageView(this);view.setAdjustViewBounds(true);root.addView(view,new LinearLayout.LayoutParams(-1,0,1));setContentView(root);try{BitmapFactory.Options opts=new BitmapFactory.Options();opts.inJustDecodeBounds=true;try(InputStream input=getContentResolver().openInputStream(getIntent().getData())){BitmapFactory.decodeStream(input,null,opts);}opts.inSampleSize=1;while(opts.outWidth/opts.inSampleSize>1600||opts.outHeight/opts.inSampleSize>2200)opts.inSampleSize*=2;opts.inJustDecodeBounds=false;try(InputStream input=getContentResolver().openInputStream(getIntent().getData())){image=BitmapFactory.decodeStream(input,null,opts);}if(image==null)throw new Exception();view.setImageBitmap(image);}catch(Exception e){Toast.makeText(this,"Bildformat wird hier nicht unterstützt. Bitte die Datei speichern und mit einer geeigneten App öffnen.",Toast.LENGTH_LONG).show();finish();}}
    @Override protected void onDestroy(){if(image!=null)image.recycle();super.onDestroy();}
}
