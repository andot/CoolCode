---
title: 媒体广告变现优化之道（一）
date: 2020-02-17 20:10:00
updated: 2020-02-17 20:10:00
categories: [广告]
tags: [广告, Android, iOS]
---

# 如何获取 make，brand 和 model

## 引用

如今，媒体与广告平台之间的对接方式除了直接使用广告平台提供的 SDK 以外，还有很多是采用 API 方式来对接的。

在 API 对接方式下，媒体需要自己通过 API 将广告请求发送给广告主，广告主根据媒体发来的广告请求来返回响应的广告。

在通过 API 发送的广告请求中，通常会包含一些设备的信息，例如设备唯一标识，制造商，品牌，型号，联网方式，网络运营商，地理位置，UserAgent 等等，广告主会通过这些设备信息来更好优化返回的广告内容，提高变现率。

今天我们先来说一下三个最基本的设备信息 make，brand 和 model 的获取方法。

<!--more-->

目前，大部分广告 API 的对接协议都是以 OpenRTB 为基础进行设计的。

在原版的 OpenRTB 中，上面三个设备信息中包含有两个，它们分别是 make 和 model。

其中 make 表示设备的生产制造商（比如 "Xiaomi"），而 model 表示设备的具体型号（比如 "Redmi K30 5G"）。

brand 表示设备的品牌（比如 "Redmi"），虽然在 OpenRTB 中没有定义，但是通常的 API 对接协议中也包含有它。

下面我们分别就 Android 和 iOS 这两种系统来说一下这三个设备信息如何获取。

## Android 系统下的获取方法

对于 Android 系统来说，这三个信息在 `android.os.Build` 类中都有明确的定义，获取方式非常简单直接：

```java
import android.os.Build;

final class DeviceInfo {
    static String getMake() {
        return Build.MANUFACTURER;
    }

    static String getBrand() {
        return Build.BRAND;
    }

    static String getModel() {
        return Build.MODEL;
    }
}
```

这里就不在详细展开说明了。

## iOS 系统下的获取方法

对于 iOS 系统来说，在 OpenRTB 中，make 和 model 的取值都有明确的说明。

其中 make 的取值就是 "Apple"。

model 的取值最好是使用 "iPhone10,1" 这样的具体型号，也可以使用 "iPhone" 这种比较笼统的型号。

brand 没有具体的说明，它的取值可以是 "Apple"，也可以使用 "iPhone", "iPad" 作为其取值。

我个人认为，brand 的取值最好不要使用 "Apple"，因为这样跟 make 的取值一样，没有实际意义。

而如果 model 采用 "iPhone10,1" 这样的具体型号，而 brand 采用 "iPhone" 这样的取值，会让这三个信息都有各自存在的意义。

例如，如果 model 的取值是 "x86_64"，而 brand 的取值是 "iPhone"，这种情况下，就可以判断这个设备是 iPhone 模拟器。

下面是在 iOS 下获取这三个设备信息的代码：

```objc
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "sys/utsname.h"

@interface DeviceInfo : NSObject

+ (const NSString *)model;
+ (const NSString *)make;
+ (const NSString *)brand;

@end

@implementation DeviceInfo

static const NSString* deviceModel;

+ (const NSString *)model {
    if (deviceModel == nil) {
        struct utsname systemInfo;
        uname(&systemInfo);
        deviceModel = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding] ?: [UIDevice currentDevice].model;
    }
    return deviceModel;
}

+ (const NSString *)make {
    return @"Apple";
}

+ (const NSString *)brand {
    return [UIDevice currentDevice].model;
}

@end
```

model 的取值对于特定的设备来说是不会变的，因此上面的代码中，对获取 model 值做了一下缓存优化。
