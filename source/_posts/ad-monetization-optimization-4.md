---
title: 媒体广告变现优化之道（四）
date: 2020-03-06 15:57:00
updated: 2020-03-06 17:54:00
categories: [广告]
tags: [广告, Android, iOS]
---

# 如何获取设备屏幕信息

今天我们来聊聊获取设备屏幕的分辨率，DPI，屏幕尺寸，缩放因子等信息。

在 OpenRTB 中，关于设备屏幕的信息有以下四个属性：

| Attribute | Type    | Definition                                                 |
| --------- | ------- | ---------------------------------------------------------- |
| h         | integer | Physical height of the screen in pixels.                   |
| w         | integer | Physical width of the screen in pixels.                    |
| ppi       | integer | Screen size as pixels per linear inch.                     |
| pxratio   | float   | The ratio of physical pixels to device independent pixels. |

其中 `w`, `h` 对应屏幕物理宽高的像素值。

`ppi` 是每英寸的像素个数，不过对于 Android 设备，通常它又被称作 dpi（Dots Per Inch，每英寸点数）。

`pxratio` 是物理像素与设备无关像素的比率，也被称为缩放因子（scale factor）。

下面我们来就 Android 和 iOS 设备来分别讨论如何获取这些信息。

<!--more-->

## 获取 Android 设备的屏幕信息

对于 Android 设备来说，这些信息都可以通过 `DisplayMetrics` 类来获取。所有首先要获取一个有效的 `DisplayMetrics` 对象。

```java
    static DisplayMetrics getDisplayMetrics(Context context) {
        WindowManager wm = (WindowManager) (context.getSystemService(Context.WINDOW_SERVICE));
        DisplayMetrics dm = new DisplayMetrics();
        Display display = wm.getDefaultDisplay();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            display.getRealMetrics(dm);
        } else {
            display.getMetrics(dm);
        }
        return dm;
    }
```

`getRealMetrics` 这个方法是在 Android 4.2 之后增加的，跟 `getMetrics` 相比，通过 `getRealMetrics` 获取到的屏幕分辨率是屏幕的真正分辨率，而 `getMetrics` 获取到的屏幕分辨率是去掉了屏幕底部虚拟按键高度的分辨率。在这之前的设备可能也不支持虚拟按键，所以，也就没有这个区分。

有了 `DisplayMetrics` 对象之后，我们就可以通过它来获取上面四个属性了，通常我们会这样来写：

```java
    DisplayMetrics dm = getDisplayMetrics(context);
    int w = dm.widthPixels;
    int h = dm.heightPixels;
    int dpi = dm.densityDpi;
    float pxratio = dm.density;
```

但是这样写真的对吗？对于 `w`, `h` 和 `pxratio` 这三个的值来说，没什么问题，但是对于 `dpi` 来说，通过这种方式获取到的值其实是不对的。

在 Android 系统中，`density` 和 `densityDpi` 之间其实有一个固定的关系：

```java
   densityDpi == (int)(density * 160)
```

所以，它俩相当于同一个概念的两种不同表示方法。而我们实际要获取的 `dpi` 应该按照如下方式来获取：

```java
    int w = dm.widthPixels;
    int h = dm.heightPixels;
    float width = w / dm.xdpi;
    float height = h / dm.ydpi;
    float size = Math.sqrt(width * width + height * height);
    int ppi = (int) (Math.sqrt(w * w + h * h) / size);
```

上面的计算中，`width` 是水平英寸数，`height` 是竖直英寸数，`size` 是对角线的长度，也就是通常我们说的手机尺寸。

然后通过对角线的像素个数除以手机尺寸，获得的才是 OpenRTB 中所说的 `ppi`。

## 获取 iOS 设备的屏幕信息

对于 iOS 系统来说，`w`, `h` 和 `pxratio` 这三个值跟 Android 一样，可以比较方便的直接获取。

```objc
   CGSize size = [UIScreen mainScreen].nativeBounds.size;
   int w = (int)size.width;
   int h = (int)size.height;
   CGFloat pxratio = [UIScreen mainScreen].nativeScale;
```

但需要注意，不要用 `bounds` 和 `scale` 这两个代替上面的 `nativeBounds` 和 `nativeScale`。

因为 `bounds` 获取到的是设备无关像素（在 iOS 中被称为 `Point`）的分辨率。而 `scale` 是渲染像素（`Rendered Pixels`）跟设备无关像素（`Point`）的比值。

在 iOS 上获取 `ppi` 就没有上面那么幸运了，因为 iOS 没有提供直接获取 `ppi` 的方法。但因为我们前面讲过 iOS 设备可以获取设备型号，所以我们可以通过做一张设备型号与 `ppi` 的对照表来返回对应设备的 `ppi`，下面是到目前为止所有 iOS 设备的型号与 `ppi` 对照表：

```objc
static const NSDictionary *modelPPIs;

+ (void)load {
    modelPPIs = @{
        // iPhone 1
        @"iPhone1,1": @163,

        // iPhone 3G
        @"iPhone1,2": @163,

        // iPhone 3GS
        @"iPhone2,1": @163,

        // iPhone 4
        @"iPhone3,1": @326,

        // iPhone 4 GSM Rev A
        @"iPhone3,2": @326,

        // iPhone 4 CDMA
        @"iPhone3,3": @326,

        // iPhone 4S
        @"iPhone4,1": @326,

        // iPhone 5 (GSM)
        @"iPhone5,1": @326,

        // iPhone 5 (GSM+CDMA)
        @"iPhone5,2": @326,

        // iPhone 5C (GSM)
        @"iPhone5,3": @326,

        // iPhone 5C (Global)
        @"iPhone5,4": @326,

        // iPhone 5S (GSM)
        @"iPhone6,1": @326,

        // iPhone 5S (Global)
        @"iPhone6,2": @326,

        // iPhone 6 Plus
        @"iPhone7,1": @401,

        // iPhone 6
        @"iPhone7,2": @326,

        // iPhone 6s
        @"iPhone8,1": @326,

        // iPhone 6s Plus
        @"iPhone8,2": @401,

        // iPhone SE (GSM+CDMA)
        @"iPhone8,3": @326,

        // iPhone SE (GSM)
        @"iPhone8,4": @326,

        // iPhone 7
        @"iPhone9,1": @326,
        @"iPhone9,3": @326,

        // iPhone 7 Plus
        @"iPhone9,2": @401,
        @"iPhone9,4": @401,

        // iPhone 8
        @"iPhone10,1": @326,
        @"iPhone10,4": @326,

        // iPhone 8 Plus
        @"iPhone10,2": @401,
        @"iPhone10,5": @401,

        // iPhone X Global
        @"iPhone10,3": @458,

        // iPhone X GSM
        @"iPhone10,6": @458,

        // iPhone XS
        @"iPhone11,2": @458,

        // iPhone XS Max China
        @"iPhone11,4": @458,

        // iPhone XS Max
        @"iPhone11,6": @458,

        // iPhone XR
        @"iPhone11,8": @326,

        // iPhone 11
        @"iPhone12,1": @326,

        // iPhone 11 Pro
        @"iPhone12,3": @458,

        // iPhone 11 Pro Max
        @"iPhone12,5": @458,

        // iPad 1
        @"iPad1,1": @132,

        // iPad 3G
        @"iPad1,2": @132,

        // iPad 2nd Gen
        @"iPad2,1": @132,
        @"iPad2,2": @132,
        @"iPad2,3": @132,
        @"iPad2,4": @132,

        // iPad Mini
        @"iPad2,5": @163,
        @"iPad2,6": @163,
        @"iPad2,7": @163,

        // iPad 3rd Gen
        @"iPad3,1": @264,
        @"iPad3,2": @264,
        @"iPad3,3": @264,

        // iPad 4th Gen
        @"iPad3,4": @264,
        @"iPad3,5": @264,
        @"iPad3,6": @264,

        // iPad Air 1
        @"iPad4,1": @264,
        @"iPad4,2": @264,
        @"iPad4,3": @264,

        // iPad Mini 2
        @"iPad4,4": @326,
        @"iPad4,5": @326,
        @"iPad4,6": @326,

        // iPad Mini 3
        @"iPad4,7": @326,
        @"iPad4,8": @326,
        @"iPad4,9": @326,

        // iPad Mini 4
        @"iPad5,1": @326,
        @"iPad5,2": @326,

        // iPad Air 2
        @"iPad5,3": @264,
        @"iPad5,4": @264,

        // iPad Pro 9.7-inch
        @"iPad6,3": @264,
        @"iPad6,4": @264,

        // iPad Pro 12.9-inch
        @"iPad6,7": @264,
        @"iPad6,8": @264,

        // iPad 5th Gen, 2017
        @"iPad6,11": @264,
        @"iPad6,12": @264,

        // iPad Pro 12.9-inch, 2017
        @"iPad7,1": @264,
        @"iPad7,2": @264,

        // iPad Pro 10.5-inch, 2017
        @"iPad7,3": @264,
        @"iPad7,4": @264,

        // iPad 6th Gen, 2018
        @"iPad7,5": @264,
        @"iPad7,6": @264,

        // iPad 7th Gen, 2019
        @"iPad7,11": @264,
        @"iPad7,12": @264,

        // iPad Pro 3rd Gen 11-inch, 2018
        @"iPad8,1": @264,
        @"iPad8,3": @264,

        // iPad Pro 3rd Gen 11-inch 1TB, 2018
        @"iPad8,2": @264,
        @"iPad8,4": @264,

        // iPad Pro 3rd Gen 12.9-inch, 2018
        @"iPad8,5": @264,
        @"iPad8,7": @264,

        // iPad Pro 3rd Gen 12.9-inch 1TB, 2018
        @"iPad8,6": @264,
        @"iPad8,8": @264,

        // iPad mini 5th Gen (WiFi)
        @"iPad11,1": @326,

        // iPad mini 5th Gen
        @"iPad11,2": @326,

        // iPad Air 3rd Gen (WiFi)
        @"iPad11,3": @264,

        // iPad Air 3rd Gen
        @"iPad11,4": @264,

        // iPod Touch 1
        @"iPod1,1": @163,

        // iPod Touch 2
        @"iPod2,1": @163,

        // iPod Touch 3
        @"iPod3,1": @163,

        // iPod Touch 4
        @"iPod4,1": @326,

        // iPod Touch 5
        @"iPod5,1": @326,

        // iPod Touch 6
        @"iPod7,1": @326,

        // iPod Touch 7
        @"iPod9,1": @326,
    };
}
```

接下来只要通过我们在[第一篇](https://coolcode.org/2020/02/17/ad-monetization-optimization-1/)中介绍的方法先获取设备型号，再来查这个表就可以了。

不过需要注意，如果是模拟器设备的话，获取到的设备型号是 `x86_64`，并不在这张表中，所以在查表之前最好先判断一下。

另外，如果是采用 API 方式来进行广告对接的话，关于 iOS 设备 `ppi` 的获取，最好是在服务器端通过这种表格的方式来查询，因为如果苹果出了新设备，客户端来不及更新的话，在新设备上就无法获取到正确的 `ppi`。但是在服务器端是可以做到及时更新生效的。
