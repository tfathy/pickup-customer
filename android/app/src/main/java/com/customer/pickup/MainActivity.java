package com.customer.pickup;

import com.getcapacitor.BridgeActivity;

import android.os.Bundle;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
        registerPlugin(com.getcapacitor.community.facebooklogin.FacebookLogin.class);


//    try {
//      PackageInfo info;
//      info = getPackageManager().getPackageInfo("com.customer.pickup", PackageManager.GET_SIGNATURES);
//      for (android.content.pm.Signature signature : info.signatures) {
//        MessageDigest md = MessageDigest.getInstance("SHA");
//        md.update(signature.toByteArray());
//        String sign = Base64.encodeToString(md.digest(), Base64.DEFAULT);
//        Log.e("MY KEY HASH:", sign);
//
//      }
//    } catch (PackageManager.NameNotFoundException e) {
//      Log.e("name not found", e.toString());
//    } catch (NoSuchAlgorithmException e) {
//      Log.e("no such an algorithm", e.toString());
//    }catch(Exception ex){
//      Log.e("exception", ex.toString());
//    }

  }
}
