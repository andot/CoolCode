---
title: 如何在 VS2017 下编译 Hprose 3.0 for .NET
date: 2019-02-22 20:47:00
updated: 2019-02-22 20:41:00
categories: [编程, Hprose]
tags: [hprose, .net, c#]
---

经过一年的开发，Hprose 3.0 for .NET 终于基本上完成了。

这次升级对 Hprose for .NET 进行了重新设计。去掉了一些不常用的功能，新增插件机制，提升了可扩展性，并提供了许多常用插件，取消了对一些过时的 .NET 平台的支持。仅保留了对 .NET 3.5 Compact Framework、.NET 4.0+、.NET Core 2.0+、.NETStandard 2.0（包含 Android、iOS、Mac 平台）的支持。

这次升级后的代码，使用了最新版本的 C# 的语法来编写，代码在可读性和性能上较之之前的版本都有了极大的改进。

下面我们就来看看 Hprose 3.0 for .NET 在 VS2017 下该如何编译。

首先，操作系统我使用的是当下的最新版本的 Windows 10（1809-17763.316），其他旧版本的 Windows 操作系统不保证一定可以成功。

从 [hprose/hprose-dotnet](https://github.com/hprose/hprose-dotnet) 下载最新版本的代码。如果你不打算提交你的修改，最好不要使用 git clone 来下载整个项目，因为使用 git clone 下载的内容有 300 多 M。直接点 Download ZIP 来下载，只有 300 多 K。

然后下载 [VS2017](https://visualstudio.microsoft.com/zh-hans/free-developer-offers/) 并安装，免费的社区版就可以，专业版和企业版应该也没问题。

之后，下载最新的 [.NET Core 2.2 和 .NET Framework 4.7.2 开发包](https://dotnet.microsoft.com/download) 安装。

接下来，下载 [.NET Compact Framework 3.5 Redistributable](//download.microsoft.com/download/c/b/e/cbe1c611-7f2f-4bcf-921d-2df718591e1e/NETCFSetupv35.msi) 并安装。

.NET Compact Framework 3.5 安装之后位置在：`C:\Program Files (x86)\Microsoft.NET\SDK\CompactFramework\v3.5\WindowsCE`，将其中的文件复制到：`C:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework\v3.5\Profile\CompactFramework`。

在该目录中新建目录 `RedistList`，在目录 `RedistList` 中创建文件 `FrameworkList.xml`，内容为：

```xml
<?xml version="1.0" encoding="utf-8"?>
<FileList Redist="Net35-CF" Name=".NET Compact Framework 3.5">
</FileList>
```

接下来，就可以用 VS2017 打开 `Hprose.sln` 进行编译了。