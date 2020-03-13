---
title: 媒体广告变现优化之道（五）
date: 2020-03-11 15:50:00
updated: 2020-03-11 19:31:00
categories: [广告]
tags: [广告, Android, iOS]
---

# 如何获取网络运营商信息

今天我们来聊聊获取网络运营商信息。

在 OpenRTB 中，关于网络运营商的信息有三个属性：`carrier`, `mccmnc` 和 `mccmncsim`。

其中 `carrier` 是运营商的字符串名称，比如『中国移动』，『中国联通』，当然，用英文或者用数字表示都可以，其取值只要通讯双方规定好就可以了。

`mccmnc` 是 `MCC`（移动国家码 Mobile Country Code）和 `MNC`（移动网络码 Mobile Network Code）的组合，格式为 `MCC-MNC`。

`MCC` 的资源由国际电联（ITU）统一分配和管理，唯一识别移动用户所属的国家，共 3 位，中国为 `460`。

`MNC` 有 2 位的 也有 3 位的，在中国使用的是 2 位。例如中国移动 TD 系统使用 `00`，中国联通 GSM 系统使用 `01`，中国移动 GSM 系统使用 `02`，中国电信 CDMA 系统使用 `03` 等。

`mccmncsim` 是 SIM 卡的 `MCC` 和 `MNC`，格式跟 `mccmnc` 一样。如果两个值都有效，当这两个值不同时，说明用户正处于漫游中。

另外，我们通常还会使用 `PLMN`（Public Land Mobile Network）或 `HNI`（Home network identity）来表示 `MCC` 和 `MNC` 的组合，但是在格式上，`MCC` 和 `MNC` 中间没有 `-` 作为分割。

下面的代码我们统一使用 `PLMN` 来做说明。

<!--more-->

## 获取 Android 设备的 `PLMN`

```java
static String getPLMN(Context context) {
    TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    if (telephonyManager != null) {
        return telephonyManager.getSimOperator();
    }
    return "";
}
```

通过 `getSimOperator` 这个方法可以直接获取 `PLMN`。但是 Android 设备不一定都是手机，所以这里需要判断一下 `telephonyManager` 是否为空。

## 获取 iOS 设备的 `PLMN`

```objc
+ (const NSString *)plmn {
    CTTelephonyNetworkInfo *info = [CTTelephonyNetworkInfo new];
    if (info == nil) return @"";
    CTCarrier * carrier = nil;
    // iOS 12.0 有 bug，这个方法虽然文档中说在 iOS 12.0 中有效，实际上并不能用，在 iOS 12.1 中才修复。
    // 不用 @available 判断是因为 XCode 新版本编译的库在 XCode 旧版本上不支持。
    if ([UIDevice currentDevice].systemVersion.floatValue >= 12.1) {
        if ([info respondsToSelector:@selector(serviceSubscriberCellularProviders)]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunsupported-availability-guard"
#pragma clang diagnostic ignored "-Wunguarded-availability"
#pragma clang diagnostic ignored "-Wunguarded-availability-new"
            NSDictionary *dict = [info serviceSubscriberCellularProviders];
#pragma clang diagnostic pop
            if (dict.count > 0) {
                carrier = [dict objectForKey:dict.allKeys[0]];
            }
        }
    } else {
        if ([info respondsToSelector:@selector(subscriberCellularProvider)]) {
            carrier = [info subscriberCellularProvider];
        }
    }
    if (carrier) {
        NSString *mcc = [carrier mobileCountryCode];
        NSString *mnc = [carrier mobileNetworkCode];
        if (mcc != nil && mnc != nil) {
            return [mcc stringByAppendingString: mnc];
        }
    }
    return @"";
}
```

iOS 上，代码看上去虽然有些复杂，但原理上很简单，首先获取 `CTCarrier` 对象，然后通过该对象上的 `mobileCountryCode` 和 `mobileNetworkCode` 属性来分别获取 `MCC` 和 `MNC`，最后将它们组合为 `PLMN` 返回。

`CTCarrier` 对象在新版本的 iOS 上跟旧版本的获取方式稍有不同，因为新的 iOS 版本增加了对 iPhone 的双卡支持。旧的方法 `subscriberCellularProvider` 在 iOS 12 之后已经被标记为 `Deprecated`，所以上面的代码中，做了一下 iOS 版本判断。不过即使采用新的方法，获取到的也不一定是 iPhone 的主卡。

如果非要获取主卡，也不是没有办法，可以通过获取状态栏的运营商信息来做匹配，但是通过状态栏获取运营商信息的方式太复杂了，在 iOS 13 之后和之前的方式不一样，刘海屏和非刘海屏也有区别，这里就不贴代码了。

## 获取运营商的名称

获取网络运营商名称可以通过跟上面类似的方式来直接获取，也可以根据上面获取到的 PLMN 来查表获取。因此通常只需要获取 PLMN 就可以了，然后在服务器端通过查表的方式来转换成对应的网络运营商名称。