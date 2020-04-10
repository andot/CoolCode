---
title: 媒体广告变现优化之道（七）
date: 2020-04-10 12:32:00
updated: 2020-03-10 12:32:00
categories: [广告]
tags: [广告, Android, iOS]
---

# 如何获取地理位置信息

OpenRTB 中有一个 `geo` 字段，该字段对应一个 `geo` 对象，这个对象中有好多字段，这里只讨论两个关键的字段 `lat` 和 `lon` 字段的获取。其中 `lat` 表示纬度，`lon` 表示经度。

<!--more-->

## 获取 Android 设备的地理位置信息

```java

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Process;

import java.util.List;

final class GeoInfo {
    private static LocationListener locationListener;
    private static volatile Location location;

    static void init(Context context) {
        final LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        List<String> providers = locationManager.getProviders(true);
        String provider = null;
        if (context.checkPermission(Manifest.permission.ACCESS_COARSE_LOCATION, Process.myPid(), Process.myUid()) == PackageManager.PERMISSION_GRANTED) {
            if (providers.contains(LocationManager.NETWORK_PROVIDER)) {
                provider = LocationManager.NETWORK_PROVIDER;
            }
        }
        if (provider == null) {
            if (context.checkPermission(Manifest.permission.ACCESS_FINE_LOCATION, Process.myPid(), Process.myUid()) == PackageManager.PERMISSION_GRANTED) {
                if (providers.contains(LocationManager.GPS_PROVIDER)) {
                    provider = LocationManager.GPS_PROVIDER;
                } else if (providers.contains(LocationManager.PASSIVE_PROVIDER)) {
                    provider = LocationManager.PASSIVE_PROVIDER;
                }
            }
        }
        if (provider == null) {
            return;
        }
        location = locationManager.getLastKnownLocation(provider);
        if (location != null) {
            return;
        }
        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                GeoInfo.location = location;
                if (locationListener != null) {
                    locationManager.removeUpdates(locationListener);
                }
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {
            }

            @Override
            public void onProviderEnabled(String provider) {
            }

            @Override
            public void onProviderDisabled(String provider) {
            }
        };
        final String finalProvider = provider;
        if (context.checkPermission(Manifest.permission.ACCESS_FINE_LOCATION, Process.myPid(), Process.myUid()) == PackageManager.PERMISSION_GRANTED &&
                context.checkPermission(Manifest.permission.ACCESS_COARSE_LOCATION, Process.myPid(), Process.myUid()) == PackageManager.PERMISSION_GRANTED) {
            try {
                locationManager.requestLocationUpdates(finalProvider, 0, 0, locationListener);
            } catch (Exception e) {
            }
        }
    }

    static double getLatitude() {
        if (location == null) return 0.0;
        return location.getLatitude();
    }

    static double getLongitude() {
        if (location == null) return 0.0;
        return location.getLongitude();
    }

    static float getAccuracy() {
        if (location == null) return 0.0f;
        return location.getAccuracy();
    }

}
```

这里为了不增加依赖，我们直接用了 `Context` 的 `checkPermission` 方法来进行权限检测。

另外，在 `AndroidManifest.xml` 中还需要加入下面的权限声明：

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## 获取 iOS 设备的地理位置信息

```objc
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface GeoInfo()<CLLocationManagerDelegate>
@end

@implementation GeoInfo

static const GeoInfo *delegate;
static const CLLocationManager* locationManager;
static double latitude = 0;
static double longitude = 0;
static double accuracy = 0;

+(void)load {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        delegate = [GeoInfo new];
        locationManager = [CLLocationManager new];
        locationManager.delegate = delegate;
        locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        [locationManager requestWhenInUseAuthorization];
        [locationManager startMonitoringSignificantLocationChanges];
        [locationManager startUpdatingLocation];
    });
}

- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray<CLLocation *> *)locations {
    CLLocation *location = [locations lastObject];
    latitude = location.coordinate.latitude;
    longitude = location.coordinate.longitude;
    accuracy = manager.desiredAccuracy;
    [locationManager stopUpdatingLocation];
}

+ (const double)latitude {
    return latitude;
}

+ (const double)longitude {
    return longitude;
}

+ (const double)accuracy {
    return accuracy;
}

@end
```

在 iOS 中要获取地理位置信息，除了使用上面的代码之外，还需要在 `info.plist` 添加 `Privacy - Location Always Usage Description` 或者 `Privacy - Location When In Use Usage Description` 权限，类型为 `String`，`value` 中一定要有值， 来告诉用户使用定位服务的目的（一直定位/当用户使用时定位）。然后在程序的 `Build Phases` 的 `Link Binary With Libraries` 导入 `CoreLocation.framework` 就可以了。
