---
title: 媒体广告变现优化之道（六）
date: 2020-04-09 19:32:00
updated: 2020-03-09 19:32:00
categories: [广告]
tags: [广告, Android, iOS]
---

# 如何获取网络连接类型

OpenRTB 中还有一个 `connectiontype` 字段，在 OpenRTB 3.0 里面叫 `contype`，其实表示的都是网络连接类型，其中包含有 Ethernet，WIFI，2G，3G，4G，5G 和未知移动网络类型。下面我们就来看看如何在 Android 和 iOS 中如何获取网络连接类型。

<!--more-->

## 获取 Android 设备的 `ConnectionType`

```java
public static String getConnectionType() {
    String connectionType = "";
    NetworkInfo networkInfo = ((ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE)).getActiveNetworkInfo();
    if (networkInfo != null && networkInfo.isConnected()) {
        int type = networkInfo.getType();
        if (type == ConnectivityManager.TYPE_WIFI) {
            connectionType = "wifi";
        } else if (type == ConnectivityManager.TYPE_ETHERNET) {
            connectionType = "ethernet";
        } else if (type == ConnectivityManager.TYPE_MOBILE) {
            String subTypeName = networkInfo.getSubtypeName();
            int networkType = networkInfo.getSubtype();
            switch (networkType) {
                case TelephonyManager.NETWORK_TYPE_GPRS:
                case TelephonyManager.NETWORK_TYPE_EDGE:
                case TelephonyManager.NETWORK_TYPE_CDMA:
                case TelephonyManager.NETWORK_TYPE_1xRTT:
                case TelephonyManager.NETWORK_TYPE_IDEN:
                case TelephonyManager.NETWORK_TYPE_GSM:
                    connectionType = "2g";
                    break;
                case TelephonyManager.NETWORK_TYPE_UMTS:
                case TelephonyManager.NETWORK_TYPE_EVDO_0:
                case TelephonyManager.NETWORK_TYPE_EVDO_A:
                case TelephonyManager.NETWORK_TYPE_HSDPA:
                case TelephonyManager.NETWORK_TYPE_HSUPA:
                case TelephonyManager.NETWORK_TYPE_HSPA:
                case TelephonyManager.NETWORK_TYPE_EVDO_B:
                case TelephonyManager.NETWORK_TYPE_EHRPD:
                case TelephonyManager.NETWORK_TYPE_HSPAP:
                case TelephonyManager.NETWORK_TYPE_TD_SCDMA:
                    connectionType = "3g";
                    break;
                case TelephonyManager.NETWORK_TYPE_LTE:
                case TelephonyManager.NETWORK_TYPE_IWLAN:
                case 19: // TelephonyManager.NETWORK_TYPE_LTE_CA
                    connectionType = "4g";
                    break;
                default:
                    if (subTypeName.equalsIgnoreCase("TD-SCDMA") ||
                            subTypeName.equalsIgnoreCase("WCDMA") ||
                            subTypeName.equalsIgnoreCase("CDMA2000")) {
                        connectionType = "3g";
                    } else if (subTypeName.equalsIgnoreCase("NR")) {
                        connectionType = "5g";
                    } else {
                        connectionType = "cell_unknown";
                    }
                    break;
            }
        }
    }
    return connectionType;
}
```

## 获取 iOS 设备的 `ConnectionType`

```objc
+ (const NSString *)connectionType {
    struct sockaddr_in zeroAddress;
    bzero(&zeroAddress, sizeof(zeroAddress));
    zeroAddress.sin_len = sizeof(zeroAddress);
    zeroAddress.sin_family = AF_INET;
    SCNetworkReachabilityRef defaultRouteReachability = SCNetworkReachabilityCreateWithAddress(NULL, (struct sockaddr *)&zeroAddress);
    SCNetworkReachabilityFlags flags;
    SCNetworkReachabilityGetFlags(defaultRouteReachability, &flags);
    CFRelease(defaultRouteReachability);
    if ((flags & kSCNetworkReachabilityFlagsReachable) == 0) {
        return @"";
    }
    if ((flags & kSCNetworkReachabilityFlagsConnectionRequired) == 0) {
        return @"wifi";
    }
    if (((flags & kSCNetworkReachabilityFlagsConnectionOnDemand) != 0) ||
        (flags & kSCNetworkReachabilityFlagsConnectionOnTraffic) != 0) {
        if ((flags & kSCNetworkReachabilityFlagsInterventionRequired) == 0) {
            return @"wifi";
        }
    }
    if ((flags & kSCNetworkReachabilityFlagsIsWWAN) == kSCNetworkReachabilityFlagsIsWWAN) {
        CTTelephonyNetworkInfo *info = [CTTelephonyNetworkInfo new];
        if (info) {
            NSString *currentStatus = nil;
            if ([UIDevice currentDevice].systemVersion.floatValue >= 12.1) {
                if ([info respondsToSelector:@selector(serviceCurrentRadioAccessTechnology)]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunsupported-availability-guard"
#pragma clang diagnostic ignored "-Wunguarded-availability"
#pragma clang diagnostic ignored "-Wunguarded-availability-new"
                    NSDictionary *dict = [info serviceCurrentRadioAccessTechnology];
#pragma clang diagnostic pop
                    if (dict.count) {
                        currentStatus = [dict objectForKey:dict.allKeys[0]];
                    }
                }
            } else {
                if ([info respondsToSelector:@selector(currentRadioAccessTechnology)]) {
                    currentStatus = [info currentRadioAccessTechnology];
                }
            }
            NSArray *network2G = @[CTRadioAccessTechnologyEdge,
                                   CTRadioAccessTechnologyGPRS,
                                   CTRadioAccessTechnologyCDMA1x];
            NSArray *network3G = @[CTRadioAccessTechnologyWCDMA,
                                   CTRadioAccessTechnologyHSDPA,
                                   CTRadioAccessTechnologyHSUPA,
                                   CTRadioAccessTechnologyCDMAEVDORev0,
                                   CTRadioAccessTechnologyCDMAEVDORevA,
                                   CTRadioAccessTechnologyCDMAEVDORevB,
                                   CTRadioAccessTechnologyeHRPD];
            NSArray *network4G = @[CTRadioAccessTechnologyLTE];
            if ([network2G containsObject:currentStatus]) {
                return @"2g";
            }
            if ([network3G containsObject:currentStatus]) {
                return @"3g";
            }
            if ([network4G containsObject:currentStatus]){
                return @"4g";
            }
            return @"cell_unknown";
        }
    }
    return @"";
}
```

上面的代码已经说明了一切，就不做解释了。