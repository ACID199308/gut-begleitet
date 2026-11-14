package de.acid199308.gutbegleitet;
import android.app.*;
import android.content.*;
import android.os.*;
import android.hardware.biometrics.*;
import android.view.*;
import android.widget.*;
import org.json.JSONObject;

/** Native gate shared by the main screen and private PDF/image viewers. */
public class AppLockActivity extends Activity {
    private static final int VERIFY=810;
    private View shield;
    private volatile boolean locked;
    private boolean authenticating;
    private boolean requestOnResume=true,resumed=false,credentialVerified=false;
    private CancellationSignal cancellation;
    private java.util.function.Consumer<Boolean> completion;
    boolean lockEnabled(){return getSharedPreferences("app-security",MODE_PRIVATE).getBoolean("enabled",false);}
    boolean deviceSecure(){return ((KeyguardManager)getSystemService(KEYGUARD_SERVICE)).isDeviceSecure();}
    boolean appAccessible(){return !lockEnabled()||!locked;}
    @Override public void onCreate(Bundle state){super.onCreate(state);locked=lockEnabled();if(locked)getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);}
    private void conceal(){
        if(!lockEnabled())return;locked=true;getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        findViewById(android.R.id.content).setVisibility(View.INVISIBLE);
        if(shield==null){LinearLayout box=new LinearLayout(this);box.setOrientation(LinearLayout.VERTICAL);box.setGravity(Gravity.CENTER);box.setPadding(32,32,32,32);box.setBackgroundColor(0xfff7f8f3);TextView title=new TextView(this);title.setText("Gut begleitet\nDeine App ist gesperrt");title.setTextSize(23);title.setGravity(Gravity.CENTER);box.addView(title);Button unlock=new Button(this);unlock.setText("App entsperren");unlock.setOnClickListener(v->unlock());box.addView(unlock);Button emergency=new Button(this);emergency.setText("Notruf 112");emergency.setOnClickListener(v->startActivity(new Intent(Intent.ACTION_DIAL,android.net.Uri.parse("tel:112"))));box.addView(emergency);shield=box;((ViewGroup)getWindow().getDecorView()).addView(shield,new ViewGroup.LayoutParams(-1,-1));}
        shield.setVisibility(View.VISIBLE);shield.bringToFront();
    }
    private void reveal(){if(lockEnabled()&&!resumed){requestOnResume=true;conceal();return;}locked=false;findViewById(android.R.id.content).setVisibility(View.VISIBLE);if(shield!=null)shield.setVisibility(View.GONE);if(!lockEnabled())getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);}
    @Override protected void onResume(){super.onResume();resumed=true;if(credentialVerified){credentialVerified=false;reveal();return;}if(lockEnabled()&&locked){conceal();if(requestOnResume&&!authenticating){requestOnResume=false;getWindow().getDecorView().post(()->unlock());}}else if(!lockEnabled())reveal();}
    @Override protected void onPause(){resumed=false;if(lockEnabled()){if(!authenticating)requestOnResume=true;conceal();}super.onPause();}
    void unlock(){if(!lockEnabled()){reveal();return;}authenticate(ok->{if(ok)reveal();});}
    void changeAppLock(boolean enabled){
        if(!appAccessible()||authenticating)return;
        if(!deviceSecure()){Toast.makeText(this,"Bitte zuerst einen Gerätecode in den Smartphone-Einstellungen einrichten.",Toast.LENGTH_LONG).show();lockStatusChanged();return;}
        authenticate(ok->{if(ok){boolean saved=getSharedPreferences("app-security",MODE_PRIVATE).edit().putBoolean("enabled",enabled).commit();if(saved){reveal();if(enabled)getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);}else Toast.makeText(this,"Einstellung konnte nicht gespeichert werden.",Toast.LENGTH_LONG).show();}lockStatusChanged();});
    }
    void lockStatusChanged(){}
    String appLockStatus(){try{return new JSONObject().put("enabled",lockEnabled()).put("available",deviceSecure()).toString();}catch(Exception e){return "{}";}}
    private void authenticate(java.util.function.Consumer<Boolean> callback){
        if(authenticating)return;if(!deviceSecure()){Toast.makeText(this,"Zum Entsperren ist die Gerätesperre erforderlich. Bitte in den Smartphone-Einstellungen prüfen.",Toast.LENGTH_LONG).show();callback.accept(false);return;}
        authenticating=true;completion=callback;
        try{if(Build.VERSION.SDK_INT>=30){cancellation=new CancellationSignal();new BiometricPrompt.Builder(this).setTitle("Gut begleitet entsperren").setSubtitle("Mit Biometrie oder deinem Gerätecode bestätigen").setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG|BiometricManager.Authenticators.DEVICE_CREDENTIAL).build().authenticate(cancellation,getMainExecutor(),new BiometricPrompt.AuthenticationCallback(){@Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result){finishAuthentication(true);}@Override public void onAuthenticationError(int code,CharSequence text){finishAuthentication(false);}});}else{Intent intent=((KeyguardManager)getSystemService(KEYGUARD_SERVICE)).createConfirmDeviceCredentialIntent("Gut begleitet entsperren","Bitte mit deinem Gerätecode bestätigen");if(intent==null){finishAuthentication(false);return;}startActivityForResult(intent,VERIFY);}}catch(Exception e){finishAuthentication(false);}
    }
    private void finishAuthentication(boolean ok){authenticating=false;cancellation=null;java.util.function.Consumer<Boolean> next=completion;completion=null;if(next!=null)next.accept(ok);}
    @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request==VERIFY){credentialVerified=result==RESULT_OK;finishAuthentication(result==RESULT_OK);}}
    @Override protected void onDestroy(){if(cancellation!=null)cancellation.cancel();completion=null;super.onDestroy();}
}
