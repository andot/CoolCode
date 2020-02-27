---
title: 媒体广告变现优化之道（三）
date: 2020-02-27 09:46:00
updated: 2020-02-27 21:46:00
categories: [广告]
tags: [广告, Android, iOS]
---

# 如何获取 User Agent

书接上回，前面两篇文章分别讲解了[如何获取 make，brand 和 model](https://coolcode.org/2020/02/17/ad-monetization-optimization-1/)和[如何获取移动设备唯一标识](https://coolcode.org/2020/02/21/ad-monetization-optimization-2/)。今天我们来讲讲 User Agent 的获取方法。

## User Agent 是什么

User Agent 中文名为用户代理，简称 UA，它是一个特殊的字符串，它其中包含了客户端的设备型号，操作系统及版本、浏览器及版本、浏览器渲染引擎等信息。服务器可以通过它来对客户端进行各种分类统计，因此，对于移动广告来说，它是一个十分重要的请求参数，如果没有提交正确 User Agent，将会严重影响广告的正常充填。

User Agent 虽然包含了这么多信息，但是它并不需要用户自己来构造。对于浏览器来说，每个浏览器都有自己默认的 User Agent，比如对于 Chrome 来说，它的 User Agent 看上去是下面这个样子：

```
Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19
```

```
Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1
```

从上面两个 User Agent 中，我们可以看出第一个是来自 Android 4.0.4 系统的 Chrome 浏览器的，甚至我们还能知道它是来自 Galaxy Nexus 这样一台 Android 设备的。而第二个是来自 iPhone 系统上的 Chrome 浏览器的，系统的版本号是 10.3。

也就是说，如果是在网站上投放广告（不管是普通网站，还是面向移动设备的网站）的话，User Agent 都可以自动通过浏览器的请求头部发送，当然也可以通过 JavaScript 脚本来获取 User Agent 并通过单独的请求发送。

但是对于移动广告来说，广告请求通常是使用系统自带或来自第三方的网络库发送请求的，而网络库在发送请求时，通常不会自带有效的 User Agent 信息。因此，在这种情况下，我们需要自己从 `WebView` 中来获取一个有效的 User Agent。

<!--more-->

## Android 系统下的获取方法

Android 下获取 User Agent 非常简单，不废话，直接先上代码：

```java
final class DeviceInfo {
    private static String ua = "";

    static {
        try {
            Context context = ...
            ua = new WebView(context).getSettings().getUserAgentString();
        } catch (Exception e) {
        }
    }

    static String getUserAgent() {
        return ua;
    }
}
```

上面的代码中，`context` 获取的方式有很多，而且因为这不是重点，所以代码省略了，请大家自行脑补。

## iOS 系统下的获取方法

在 iOS 8.0 之前，可以通过 `UIWebView` 来获取：

```objc
NSString* userAgent = [[UIWebView new] stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
```

但是从 iOS 8.0 开始，`UIWebView` 已经被标记为过期，不再推荐使用了，因此最好是使用 `WKWebView` 来获取：

```objc
static const NSString* userAgent;

+(void)load {
    WKWebView *webView = [[WKWebView alloc] initWithFrame:CGRectZero];
    [webView evaluateJavaScript:@"navigator.userAgent" completionHandler:^(id result, NSError *error) {
        if (error == nil && result != nil) {
            userAgent = [NSString stringWithFormat:@"%@", result];
        } else {
            userAgent = @"";
            NSLog(@"Can't get the userAgent");
        }
    }];
    while (userAgent == nil) {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }
}

+ (const NSString *)userAgent {
    return userAgent;
}
```

因为 `WKWebView` 的 `evaluateJavaScript` 方法是异步的，没办法直接得到结果，因此我们这里用 `load` 方法在 app 加载时就执行的方式，提前缓存 User Agent 的结果。并且为了保证一定可以拿到结果，这里用了 `NSRunLoop` 来保证拿到 `userAgent` 之后才会退出 `load` 方法。

除了使用 `load` 方法以外，使用 `initialize` 方法也可以实现提前加载，只是执行时机靠后一些。

但如果你所使用的是 Swift 语言，而不是 Objective-C 的话，那就没办法直接使用 `load` 或 `initialize` 方法了，因为 Swift 语言中砍掉了这两个方法。但可以使用跟 Objective-C 混编的方式来实现。

## User Agent 的合法性验证

通过 Android 的 `WebView` 获取到的 User Agent 大概有一下几种形式。

### 在 Android 4.4 (KitKat) 之前

```
Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30
```

### 从 Android 4.4 (KitKat) 到 Android 5.x（Lollipop）

```
Mozilla/5.0 (Linux; Android 4.4.4; vivo Y27 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36
```

### Android 5.x (Lollipop) 之后

```
Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36
```

从上面的划分来看，在 Android 4.4 之前的 User Agent 的格式跟 Android 4.4 之后的格式化差别有点大。但是从 Android 4.4 开始，User Agent 就都是以 `Mozilla/5.0 (Linux; Android` 作为开头的啦，考虑到 Android 4.4 之前的设备基本上已经被淘汰，因此我们可以通过匹配这段文字来对 Android 的 User Agent 的合法性进行简单的验证。

Android 5.1 之后的 User Agent 主要是增加了 `wv` 标志，而它其实是跟 `Chrome` 后面的版本号有关的，如果是 `3x.x.x.x` 版本的 `Chrome` 就没有 `wv`，如果是 `4x.x.x.x` 或者更高版本的 `Chrome`，则有 `wv`。Android 5.x 系统这两种情况都存在，这跟具体设备中内置的 `WebView` 版本有关，这里不做深究。

在 iOS 系统中，通过 `WebView` 获取的 User Agent 有下面几种形式。

### iPhone

```
Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148
```

### iPad

```
Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60
```

### iPod Touch

```
Mozilla/5.0 (iPod Touch; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)  Mobile/15E148
```

我们会发现这三种设备的 User Agent 中都包含有 `like Mac OS X` 这段共同特征的文字，并且都是以 `Mozilla/5.0 (iP` 来开头的，因此我们可以用这两个特征来对 iOS 的 User Agent 的合法性进行简单的验证。

另外，通过 User Agent 还可以提取设备类型，操作系统版本号等信息，因为只要做简单的文字匹配就可以做到，这里就不贴代码了。
