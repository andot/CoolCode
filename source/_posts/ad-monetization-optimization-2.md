---
title: 媒体广告变现优化之道（二）
date: 2020-02-21 17:46:00
updated: 2020-02-21 17:46:00
categories: [广告]
tags: [广告, Android, iOS]
---

# 如何获取移动设备唯一标识

在移动广告领域，设备唯一标识是用来追踪用户的最重要的标识。

对于精准广告和个性化推荐而言，可以通过设备唯一标识，进行千人千面的精准投放。

既然移动设备唯一标识如此的重要，那我们今天就来说一说如何获取设备的唯一标识。

<!--more-->

## IMEI/MEID

IMEI (International Mobile Equipment Identity) 是国际移动设备识别码，即通常所说的手机“串号”，用于在移动电话网络中识别每一部独立的手机等移动通信设备，相当于移动电话的身份证。IMEI 适用于 GSM、WCDMA、LTE 制式的移动设备。

MEID (Mobile Equipment IDentifier) 是移动设备识别码，它也是一个全球唯一识别移动设备的号码。但它适用于 CDMA 制式手机。

对于全网通的移动设备 IMEI 和 MEID 标识都存在，对于支持双卡的设备，还会有 2 个 IMEI/MEID。

因为这两个标识的作用相同，所以对于移动广告行业来说，一般不对 IMEI/MEID 做严格区分，在广告请求中一般作为同一个字段（比如：`DeviceID` 或缩写成 `did`）进行传输。

对于 iOS 设备来说，苹果官方在 iOS 5.0 之后就屏蔽了获取 IMEI/MEID 的接口，因此现在的苹果设备都无法获取到 IMEI/MEID。

对于 Android 设备来说，可以通过下面的方法来获取 IMEI/MEID：

```java
static String getDeviceId(Context context) {
    TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    if (tm != null) {
        try {
            String id = tm.getDeviceId();
            if (id != null) return id;
        } catch (SecurityException e) {
        }
    }
    return "";
}
```

对于非手机设备，如 Android 平板电脑，电视等，这些设备没有通话的硬件功能，系统中也就没有 `TELEPHONY_SERVICE`，所以这里要判断一下 `tm` 这个返回值是否为空。

在 Android 8.0 之后，`TelephonyManager` 上的这个 `getDeviceId` 方法尽管被标记为已过时，并提供了 `getImei` 和 `getMeid` 来取代它。但 `getDeviceId` 又不是不能用，而且我们也不需要区分获取到的究竟是 `Imei` 还是 `Meid`，所以这里我们不需要通过判断版本号的方式来替换这个方法。

获取 IMEI/MEID 的需要 `READ_PHONE_STATE` 权限，否则会发生 `SecurityException` 异常。如果应用以 Android 10 或更高版本为目标平台，在应用没有 `READ_PRIVILEGED_PHONE_STATE` 权限时，也会发生 `SecurityException` 异常，而且普通开发者开发的应用是不可能获取到该权限的。所以，调用 `tm.getDeviceId()` 时，我们加了 `try/catch` 语句，避免崩溃。

## IMSI

IMSI (International Mobile Subscriber Identity) 是国际移动用户识别码。通俗的讲，它是相对手机卡而言的唯一识别码。

在 iOS 设备上，跟 IMEI/MEID 一样，是无法获取到 IMSI 的。

对于 Android 设备来说，获取 IMSI 的方法跟获取 IMEI/MEID 的方法类似：

```java
static String getIMSI(Context context) {
    TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    if (tm != null) {
        try {
            String id = tm.getSubscriberId();
            if (id != null) return id;
        } catch (SecurityException e) {
        }
    }
    return "";
}
```

在 Android 上获取 IMSI 的权限要求跟 IMEI/MEID 一样，这里就不在重复。

## Android ID

Android ID 是 Android 设备里不依赖于硬件的一种「半永久标识符」，在系统生命周期内不会改变，但系统重置或刷机后可能会发生变化，其作用域为一组有关联的应用。

Android ID 获取的方式很简单：

```java
static String getAndroidID(Context context) {
    return Secure.getString(context.getContentResolver(), Secure.ANDROID_ID);
}
```

但是在 Android 8.0 以后，签名不同的 App 所获取的 Android ID 是不一样的，但同一个开发者可以根据自己的数字签名，将所开发的不同 App 进行关联。

## Android AdID

Android AdID (简称 AAID) 是 Android 平台专为广告跟踪提供的唯一标识。但是 AAID 依赖 Google 服务框架，但国内手机基本上都没有内置 Google 服务框架，这种情况下，就无法获取 AAID。因此，这里就不做讨论了。

## OAID

上面在介绍 IMEI/MEID 时谈到过，在 Android 10 以后，IMEI/MEID、IMSI 这些设备标识都被限制读取了。没有了 IMEI/MEID、IMSI 这些设备唯一标识，对于国内广告行业来说，简直是灭顶之灾。不过正所谓道高一尺魔高一丈，为了拯救国内移动广告市场，[移动安全联盟(MSA)](http://msa-alliance.cn/col.jsp?id=120) 推出了一套“移动智能终端补充设备标识体系”，并根据这套体系的技术要求，联盟开发并发布了一套支持多厂商的统一的补充设备标识调用 SDK。

这套体系中包含了四种标识符：UDID（设备唯一标识符）, OAID（匿名设备标识符）, VAID（开发者匿名设备标识符）, AAID（应用匿名设备标识符）。

这四种标识符中，UDID 相当于 IMEI/MEID，它具有无法重置，始终不变的特性。但是它不是提供给广告业务使用的，并且在统一 SDK v1.0.10 版本之后，这个标识符的获取接口被移除了。

OAID（匿名设备标识符）是用于广告业务的标识符，它在系统首次启动后立即生成，它虽然允许用户手动重置，在刷机、恢复出厂设置等特殊情况下也会重置，但是对于同一台设备上的不同 App，只要没有被重置的情况下，获取到的值都是一致的。因此，虽然它的跟踪特性跟 IMEI/MEID 相比稍微差了点，但是比 Android ID 还是要好一些的。

关于如何获取 OAID，在 [移动安全联盟(MSA)](http://msa-alliance.cn/col.jsp?id=120) 官网的文档里有详细说明，在我们公司的[广告 SDK 演示实例](https://github.com/adtalos/android-xy-sdk-demo)中也给出了具体的代码实例，由于代码较长，这里就不再单独贴出来了。

另外多说一句，如果想要在 Flutter 开发的 Android 应用中获取 OAID 的话，可以使用 [flutter_msa_sdk](https://pub.dev/packages/flutter_msa_sdk) 这个插件，这个插件也是我们公司开发的，不过没有什么技术难度，只是对[移动安全联盟(MSA)](http://msa-alliance.cn/col.jsp?id=120) 的统一 SDK 做了一下封装，不过用起来要比 Android 原版容易的多。

## IDFA/IDFV

前面我们说了，iOS 设备虽然也有 IMEI、IMSI，但是苹果说要保护用户隐私，于是在 iOS 5.0 之后，就把这些接口取消了，不再允许开发者来获取它们了。

可是隐私归隐私，广告还是要做的嘛，于是苹果在 iOS 6.0 之后，推出了 IDFA 这样一个专门用于广告的标识符。同时还提供了一个 IDFV，它是同一个组织下的唯一标识符。

IDFA 允许用户在设置中进行重置，刷机或重置设备时，该标识符也会重置，但是在不同的 App 之间它是同一个值。它相当于上面谈到的 OAID。

IDFV 是给 Vendor 标识用户用的，对于隶属于同一个组织的 App，在同一台设备上获取到的 IDFV 都是同一个值。假设有两个应用，它们的 BundleID 分别是 com.adtalos.demo1 和 com.adtalos.demo2，那么它们的就是同一个 Vendor，这两个应用在同一台设备中获取到的 IDFV 就是相同的。它相当于 Android ID，只是表示组织的方式不同而已。

IDFA 和 IDFV 的获取方式非常简单：

```objc
NSString *idfa = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
NSString *idfv = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
```

IDFA 和 IDFV 都可能获取不到值，获取不到时，返回值为 `nil`。

## Mac

除了以上这些 ID 标识符以外，Mac 地址通常也会用于广告追踪。

但是很不幸，从 iOS 7.0 之后，苹果就禁止开发者获取 Mac 地址了。

对于 Android 来说，情况稍微好一点，虽然从 Android 6.0 开始，通过 `WifiInfo` 获取到的 Mac 地址永远是 `02:00:00:00:00:00` 这样一个固定值。但是通过下面这个方法还是可以在大多数情况下获取到 Mac 地址的：

```java
static String getMac() {
    try {
        List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
        for (NetworkInterface nif : all) {
            if (!nif.getName().equalsIgnoreCase("wlan0") &&
                    !nif.getName().equalsIgnoreCase("eth0")) continue;
            byte[] macBytes = nif.getHardwareAddress();
            if (macBytes == null) {
                return "";
            }
            StringBuilder sb = new StringBuilder();
            for (byte b : macBytes) {
                sb.append(String.format("%02X:", b));
            }
            if (sb.length() > 0) {
                sb.deleteCharAt(sb.length() - 1);
            }
            return sb.toString();
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return "";
}
```

原理是扫描各个网络接口，当网络接口是 `wlan0` 或者 `eth0` 时，返回它的 Mac 地址。
