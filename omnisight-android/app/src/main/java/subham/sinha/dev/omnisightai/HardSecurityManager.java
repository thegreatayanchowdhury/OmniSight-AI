package subham.sinha.dev.omnisightai;

import android.content.Context;
import android.content.pm.*;
import android.location.Location;
import android.os.Build;
import android.os.Debug;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;

import org.json.JSONObject;

import java.io.*;
import java.net.Socket;
import java.util.List;

import okhttp3.*;

public class HardSecurityManager {

    private Context context;

    private Location lastLocation = null;
    private long lastTime = 0;

    public HardSecurityManager(Context context) {
        this.context = context;
    }

    // =========================
    // FINAL RISK SCORE
    // =========================
    public int getRiskScore(Location gps, Location network) {

        int risk = 0;

        // Mock detection
        if (gps != null && isMockLocation(gps)) risk += 40;
        if (network != null && isMockLocation(network)) risk += 40;

        if (hasMockLocationApps()) risk += 20;
        if (isLocationMismatch(gps, network)) risk += 15;

        // Developer + ADB
        if (isDeveloperModeEnabled()) risk += 10;
        if (isUsbDebuggingEnabled()) risk += 25;
        if (isDeveloperModeEnabled() && isUsbDebuggingEnabled()) risk += 30;

        // Root
        if (isDeviceRooted()) risk += 25;
        if (canExecuteSu()) risk += 25;

        // Emulator
        if (isEmulator()) risk += 20;

        // App integrity
        if (isAppTampered()) risk += 30;

        // Network
        if (!isSimPresent()) risk += 10;
        if (isCountryMismatch()) risk += 10;

        // Advanced detection
        if (detectFrida()) risk += 40;
        if (isDebuggerAttached()) risk += 30;
        if (detectSuspiciousApps()) risk += 25;
        if (isTestKeysBuild()) risk += 15;
        if (detectHookingFrameworks()) risk += 35;

        // Location behavior analysis
        risk += analyzeLocationBehavior(gps);

        int finalRisk = Math.min(risk, 100);

        // Send to backend
        sendFraudData(finalRisk, gps);

        return finalRisk;
    }

    public boolean isHighRisk(int score) {
        return score >= 60;
    }

    // =========================
    // LOCATION BEHAVIOR
    // =========================
    private int analyzeLocationBehavior(Location current) {

        if (current == null) return 0;

        int risk = 0;
        long now = System.currentTimeMillis();

        if (lastLocation != null) {

            float distance = current.distanceTo(lastLocation);
            long timeDiff = now - lastTime;

            if (timeDiff > 0) {
                float speed = (distance / timeDiff) * 1000;

                if (speed > 100) risk += 40;
                if (distance > 5000 && timeDiff < 10000) risk += 40;
            }
        }

        lastLocation = current;
        lastTime = now;

        return risk;
    }

    // =========================
    // MOCK LOCATION
    // =========================
    public boolean isMockLocation(Location location) {
        if (location == null) return false;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            return location.isFromMockProvider();
        }
        return false;
    }

    private boolean isLocationMismatch(Location gps, Location network) {
        if (gps == null || network == null) return false;
        return gps.distanceTo(network) > 1000;
    }

    private boolean hasMockLocationApps() {
        List<ApplicationInfo> apps =
                context.getPackageManager().getInstalledApplications(0);

        for (ApplicationInfo app : apps) {
            if ((app.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {

                String pkg = app.packageName.toLowerCase();

                if (pkg.contains("mock") || pkg.contains("gps")) {
                    return true;
                }
            }
        }
        return false;
    }

    // =========================
    // DEVICE STATE
    // =========================
    private boolean isDeveloperModeEnabled() {
        return Settings.Global.getInt(
                context.getContentResolver(),
                Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) != 0;
    }

    private boolean isUsbDebuggingEnabled() {
        return Settings.Global.getInt(
                context.getContentResolver(),
                Settings.Global.ADB_ENABLED, 0) == 1;
    }

    // =========================
    // ROOT
    // =========================
    private boolean isDeviceRooted() {
        String[] paths = {
                "/system/bin/su",
                "/system/xbin/su",
                "/sbin/su"
        };

        for (String path : paths) {
            if (new File(path).exists()) return true;
        }
        return false;
    }

    private boolean canExecuteSu() {
        try {
            Runtime.getRuntime().exec("su");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // =========================
    // EMULATOR
    // =========================
    private boolean isEmulator() {
        return Build.FINGERPRINT.startsWith("generic")
                || Build.MODEL.contains("Emulator")
                || Build.MANUFACTURER.contains("Genymotion")
                || Build.BRAND.startsWith("generic");
    }

    // =========================
    // APP INTEGRITY
    // =========================
    private boolean isAppTampered() {
        try {
            PackageInfo packageInfo = context.getPackageManager()
                    .getPackageInfo(context.getPackageName(),
                            PackageManager.GET_SIGNING_CERTIFICATES);

            Signature[] signatures =
                    packageInfo.signingInfo.getApkContentsSigners();

            for (Signature sig : signatures) {
                String current = sig.toCharsString();
                String expected = "YOUR_RELEASE_SIGNATURE_HASH";

                if (!current.equals(expected)) return true;
            }

        } catch (Exception e) {
            return true;
        }
        return false;
    }

    // =========================
    // NETWORK
    // =========================
    private boolean isSimPresent() {
        TelephonyManager tm = (TelephonyManager)
                context.getSystemService(Context.TELEPHONY_SERVICE);

        return tm != null &&
                tm.getSimState() == TelephonyManager.SIM_STATE_READY;
    }

    private boolean isCountryMismatch() {
        TelephonyManager tm = (TelephonyManager)
                context.getSystemService(Context.TELEPHONY_SERVICE);

        if (tm == null) return false;

        String sim = tm.getSimCountryIso();
        String net = tm.getNetworkCountryIso();

        return sim != null && net != null && !sim.equals(net);
    }

    // =========================
    // ADVANCED DETECTION
    // =========================
    private boolean detectFrida() {
        try {
            int[] ports = {27042, 27043};

            for (int port : ports) {
                try {
                    Socket socket = new Socket("127.0.0.1", port);
                    socket.close();
                    return true;
                } catch (Exception ignored) {}
            }

            BufferedReader reader = new BufferedReader(
                    new FileReader("/proc/self/maps"));

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.toLowerCase().contains("frida")) return true;
            }

            reader.close();

        } catch (Exception ignored) {}

        return false;
    }

    private boolean isDebuggerAttached() {
        return Debug.isDebuggerConnected() || Debug.waitingForDebugger();
    }

    private boolean detectSuspiciousApps() {
        List<ApplicationInfo> apps =
                context.getPackageManager().getInstalledApplications(0);

        for (ApplicationInfo app : apps) {
            String pkg = app.packageName.toLowerCase();

            if (pkg.contains("magisk") ||
                    pkg.contains("xposed") ||
                    pkg.contains("substrate") ||
                    pkg.contains("frida")) {

                return true;
            }
        }
        return false;
    }

    private boolean isTestKeysBuild() {
        return Build.TAGS != null && Build.TAGS.contains("test-keys");
    }

    private boolean detectHookingFrameworks() {
        try {
            BufferedReader reader = new BufferedReader(
                    new FileReader("/proc/self/maps"));

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.contains("xposed") ||
                        line.contains("substrate") ||
                        line.contains("frida")) {
                    return true;
                }
            }

            reader.close();
        } catch (Exception ignored) {}

        return false;
    }

    // =========================
    // BACKEND INTEGRATION
    // =========================
    private void sendFraudData(int riskScore, Location gps) {

        OkHttpClient client = new OkHttpClient();

        try {
            JSONObject json = new JSONObject();

            json.put("risk_score", riskScore);
            json.put("adb", isUsbDebuggingEnabled());
            json.put("rooted", isDeviceRooted());
            json.put("emulator", isEmulator());
            json.put("frida", detectFrida());
            json.put("debugger", isDebuggerAttached());

            if (gps != null) {
                JSONObject loc = new JSONObject();
                loc.put("lat", gps.getLatitude());
                loc.put("lon", gps.getLongitude());
                json.put("location", loc);
            }

            RequestBody body = RequestBody.create(
                    json.toString(),
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("http://127.0.0.1:8000/security/check")
                    .post(body)
                    .build();

            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    Log.e("BACKEND", "Failed: " + e.getMessage());
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String res = response.body().string();
                    Log.d("BACKEND", res);
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}