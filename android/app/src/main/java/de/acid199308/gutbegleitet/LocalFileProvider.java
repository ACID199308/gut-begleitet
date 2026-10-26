package de.acid199308.gutbegleitet;
import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileNotFoundException;

public class LocalFileProvider extends ContentProvider {
    public static final String AUTHORITY="de.acid199308.gutbegleitet.files";
    @Override public boolean onCreate(){return true;}
    private File file(Uri uri) throws FileNotFoundException {
        try {
            if(!AUTHORITY.equals(uri.getAuthority()))throw new FileNotFoundException();
            String path=uri.getPath();
            if(path==null||!(path.startsWith("/exports/")||path.startsWith("/camera/")))throw new FileNotFoundException();
            File root=new File(getContext().getCacheDir(),"shared").getCanonicalFile();
            File f=new File(root,path.substring(1)).getCanonicalFile();
            if(!f.getPath().startsWith(root.getPath()+File.separator))throw new FileNotFoundException();
            return f;
        } catch(java.io.IOException e){throw new FileNotFoundException();}
    }
    @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException {
        File f=file(uri);
        if("r".equals(mode))return ParcelFileDescriptor.open(f,ParcelFileDescriptor.MODE_READ_ONLY);
        if(uri.getPath().startsWith("/camera/")&&("w".equals(mode)||"wt".equals(mode)||"rw".equals(mode)))return ParcelFileDescriptor.open(f,ParcelFileDescriptor.MODE_CREATE|ParcelFileDescriptor.MODE_READ_WRITE|ParcelFileDescriptor.MODE_TRUNCATE);
        throw new FileNotFoundException("Read-only document");
    }
    @Override public String getType(Uri uri){String p=uri.getPath();if(p!=null&&p.endsWith(".pdf"))return "application/pdf";if(p!=null&&p.endsWith(".ics"))return "text/calendar";if(p!=null&&p.endsWith(".png"))return "image/png";return "image/jpeg";}
    @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String order){try{File f=file(uri);MatrixCursor c=new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE});c.addRow(new Object[]{f.getName(),f.length()});return c;}catch(Exception e){return null;}}
    @Override public Uri insert(Uri uri,ContentValues v){throw new UnsupportedOperationException();}
    @Override public int update(Uri uri,ContentValues v,String s,String[] a){throw new UnsupportedOperationException();}
    @Override public int delete(Uri uri,String s,String[] a){throw new UnsupportedOperationException();}
}
