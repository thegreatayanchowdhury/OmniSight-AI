package subham.sinha.dev.omnisightai;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private long backPressedTime;

    private static final int LOCATION_PERMISSION_CODE = 101;

    private final String URL = "https://omni-sight-ai-seven.vercel.app/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Check location permission first
        if (checkLocationPermission()) {
            startAppFlow();
        } else {
            requestLocationPermission();
        }
    }

    // Check if location permission is granted
    private boolean checkLocationPermission() {
        return ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED;
    }

    // Request location permission
    private void requestLocationPermission() {
        ActivityCompat.requestPermissions(
                this,
                new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                LOCATION_PERMISSION_CODE
        );
    }

    // Handle permission result
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == LOCATION_PERMISSION_CODE) {
            if (grantResults.length > 0 &&
                    grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                startAppFlow();

            } else {
                Toast.makeText(this,
                        "Location permission is required for security checks.",
                        Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }

    // Main app flow after permission granted
    private void startAppFlow() {

        // Run security checks before loading UI
        if (!runSecurityChecks()) {
            return;
        }

        EdgeToEdge.enable(this);

        if (getSupportActionBar() != null) getSupportActionBar().hide();

        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        hideSystemBars();

        if (BuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        FrameLayout root = new FrameLayout(this);

        webView = new WebView(this);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        root.addView(webView);
        setContentView(root);

        setupWebView();

        // Load content based on connectivity
        if (isInternetAvailable()) {
            webView.loadUrl(URL);
        } else {
            loadOfflinePage();
        }
    }

    // Perform security checks using real location data
    @SuppressLint("MissingPermission")
    private boolean runSecurityChecks() {

        try {
            HardSecurityManager security = new HardSecurityManager(this);

            LocationManager lm =
                    (LocationManager) getSystemService(Context.LOCATION_SERVICE);

            Location gps = null;
            Location network = null;

            try {
                if (lm != null) {
                    gps = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    network = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                }
            } catch (Exception ignored) {}

            int riskScore = security.getRiskScore(gps, network);

            if (security.isHighRisk(riskScore)) {

                Log.e("SECURITY", "High risk device: " + riskScore);

                Toast toast = Toast.makeText(
                        this,
                        "Security risk detected. App blocked.",
                        Toast.LENGTH_LONG
                );
                toast.setGravity(Gravity.CENTER, 0, 0);
                toast.show();

                finish();
                return false;
            }

            Log.d("SECURITY", "Safe device: " + riskScore);
            return true;

        } catch (Exception e) {
            Log.e("SECURITY", "Security error: " + e.getMessage());
            return false;
        }
    }

    // Configure WebView settings
    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            settings.setForceDark(WebSettings.FORCE_DARK_ON);
        }

        webView.setBackgroundColor(Color.TRANSPARENT);
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        webView.setWebViewClient(new WebViewClient() {

            @Override
            public void onPageFinished(WebView view, String url) {
                Log.d("WEBVIEW", "Loaded: " + url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode,
                                        String description, String failingUrl) {
                loadOfflinePage();
            }

            @Override
            public void onReceivedSslError(WebView view,
                                           SslErrorHandler handler,
                                           SslError error) {
                handler.cancel();
                Toast.makeText(MainActivity.this,
                        "SSL error. Connection blocked.",
                        Toast.LENGTH_LONG).show();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("WEBVIEW_LOG", consoleMessage.message());
                return true;
            }
        });
    }

    // Load offline HTML page
    private void loadOfflinePage() {
        String html = "<html><body style='text-align:center;padding:50px;'>"
                + "<h2>No Internet</h2>"
                + "<p>Please check your connection and try again.</p>"
                + "</body></html>";

        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
    }

    // Check internet connectivity
    private boolean isInternetAvailable() {

        ConnectivityManager cm =
                (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

        if (cm == null) return false;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            NetworkCapabilities capabilities =
                    cm.getNetworkCapabilities(cm.getActiveNetwork());

            return capabilities != null &&
                    (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR));
        } else {
            NetworkInfo info = cm.getActiveNetworkInfo();
            return info != null && info.isConnected();
        }
    }

    // Handle back navigation
    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            if (backPressedTime + 2000 > System.currentTimeMillis()) {
                super.onBackPressed();
            } else {
                backPressedTime = System.currentTimeMillis();
                Toast.makeText(this,
                        "Press back again to exit",
                        Toast.LENGTH_SHORT).show();
            }
        }
    }

    // Re-check security on resume
    @Override
    protected void onResume() {
        super.onResume();

        if (!runSecurityChecks()) {
            return;
        }

        hideSystemBars();
    }

    // Hide system UI
    private void hideSystemBars() {
        WindowInsetsControllerCompat controller =
                new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());

        controller.hide(WindowInsetsCompat.Type.systemBars());
        controller.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
    }

    // Cleanup WebView
    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}