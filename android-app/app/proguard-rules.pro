# Retrofit / OkHttp
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepattributes AnnotationDefault
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}
-dontwarn okhttp3.**
-dontwarn retrofit2.**

# Moshi
-keep @com.squareup.moshi.JsonClass class * { *; }
-keep class com.medifind.app.data.api.models.** { *; }
-keepclassmembers class com.medifind.app.data.api.models.** {
    <init>(...);
}
-keep interface com.squareup.moshi.JsonQualifier
-dontwarn com.squareup.moshi.**

# Room
-keep class com.medifind.app.data.local.entities.** { *; }

# Hilt
-keep class dagger.hilt.** { *; }
-keep class javax.inject.** { *; }
