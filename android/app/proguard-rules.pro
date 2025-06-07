# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Keep specific classes and their members for Razorpay
-keep class com.razorpay.** { *; }
-keep interface com.razorpay.** { *; }

# Depending on your React Native Razorpay integration, you might need these:
-keep class com.razorpay.reactnative.** { *; }

# Important: Prevent warnings about missing classes that R8 might not find (e.g., from reflection)
-dontwarn com.razorpay.**
-dontwarn org.apache.http.**
-dontwarn org.json.**