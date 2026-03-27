# WebView
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(...);
}

-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(...);
}

# Prevent stripping JS interfaces
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}