---
title: Hprose 3.0 for .NET 支持哪些平台
date: 2019-02-26 20:47:00
updated: 2019-02-26 20:41:00
categories: [编程, Hprose]
tags: [hprose, .net, c#]
---

[Hprose 3.0 for .NET](https://github.com/hprose/hprose-dotnet) 采用模块化设计。目前共分 7 个包，它们分别是：

* [Hprose.IO](https://www.nuget.org/packages/Hprose.IO)
* [Hprose.RPC](https://www.nuget.org/packages/Hprose.RPC)
* [Hprose.RPC.Plugins](https://www.nuget.org/packages/Hprose.RPC.Plugins)
* [Hprose.RPC.Codec.JSONRPC](https://www.nuget.org/packages/Hprose.RPC.Codec.JSONRPC)
* [Hprose.RPC.Owin](https://www.nuget.org/packages/Hprose.RPC.Owin)
* [Hprose.RPC.AspNet](https://www.nuget.org/packages/Hprose.RPC.AspNet)
* [Hprose.RPC.AspNetCore](https://www.nuget.org/packages/Hprose.RPC.AspNetCore)

[Hprose.IO](https://www.nuget.org/packages/Hprose.IO) 是 Hprose 的序列化和反序列化库。支持：

* .NET Framework 3.5 - 4.7.2
* .NET Framework Client Profile 3.5 - 4.0
* .NET Core 2.0 - 2.2
* .NET Compact Framework 3.5
* .NET Standard 2.0

[Hprose.RPC](https://www.nuget.org/packages/Hprose.RPC) 是 Hprose RPC 的核心库，提供了 Hprose RPC 的 Http、WebSocket、Tcp、Udp 的服务器和客户端的实现。跟 [Hprose.IO](https://www.nuget.org/packages/Hprose.IO) 相比，该模块除了不支持 .NET Framework 3.5 和 .NET Framework Client Profile 3.5 以外，其它支持的 .NET 环境与 [Hprose.IO](https://www.nuget.org/packages/Hprose.IO) 相同。特别要强调的是，[Hprose.RPC](https://www.nuget.org/packages/Hprose.RPC) 是支持 .NET Compact Framework 3.5 的，但是在 .NET Compact Framework 3.5 下，不支持 Http、WebSocket 服务器和 WebSocket 客户端，仅支持 Tcp、Udp 服务器和 Http、Tcp、Udp 客户端。另外，在 .NET Framework 4.0 环境下，也不支持 WebSocket 服务器和客户端。

[Hprose.RPC.Plugins](https://www.nuget.org/packages/Hprose.RPC.Plugins) 是 Hprose RPC 的插件库，提供了 Hprose RPC 的一些现成的通用插件。其中包括负载均衡插件，集群容错插件，熔断降级插件，限流插件，推送插件，反向调用插件，单项调用插件和日志插件。其支持的 .NET 环境与 [Hprose.RPC](https://www.nuget.org/packages/Hprose.RPC) 相同。

[Hprose.RPC.Codec.JSONRPC](https://www.nuget.org/packages/Hprose.RPC.Codec.JSONRPC) 是 Hprose RPC 的 JSONRPC 编码库，通过它，可以让 Hprose 服务器和客户端变身为 JSONRPC 2.0 的服务器和客户端，而且对于服务器来说，可以同时提供 JSONRPC 2.0 服务和 Hprose 3.0 服务。其支持的 .NET 环境与 [Hprose.RPC](https://www.nuget.org/packages/Hprose.RPC) 相同。

[Hprose.RPC.Owin](https://www.nuget.org/packages/Hprose.RPC.Owin) 是 Hprose RPC 在 Owin 上的服务模块。如果需要在支持 Owin 的 .NET 服务器上发布 Hprose 服务，可以使用该库。因为 Owin 是基于 Http 的 Web 服务，而 .NET Compact Framework 3.5 环境并没有提供 Http 服务，因此该模块不支持 .NET Compact Framework 3.5 环境下使用，除此之外，其支持的环境与 [Hprose.RPC](https://www.nuget.org/packages/Hprose.RPC) 相同。

[Hprose.RPC.AspNet](https://www.nuget.org/packages/Hprose.RPC.AspNet) 是 Hprose RPC 在 ASP.NET 上的服务模块。因为 ASP.NET 仅支持 .NET Framework 环境，不支持 .NET Framework Client Profile、.NET Core 和 .NET Compact Framework 环境。因此该模块仅支持在 .NET Framework 环境下使用。

[Hprose.RPC.AspNetCore](https://www.nuget.org/packages/Hprose.RPC.AspNetCore) 是 Hprose RPC 在 ASP.NET Core 上的服务模块。因为 ASP.NET Core 仅支持 .NET Core，因此该模块也仅支持在 .NET Core 下使用。

Hprose 3.0 for .NET 支持的操作系统有：

* Windows XP - Windows 10 ( .NET Standard, .NET Core, .NET Framework )
* Linux ( .NET Standard, .NET Core )
* Mac OS X ( .NET Standard, .NET Core )
* iOS ( .NET Standard )
* TvOS ( .NET Standard )
* WatchOS ( .NET Standard )
* Android ( .NET Standard )
* Windows CE ( .NET Compact Framework )

也就是说，Hprose 3.0 for .NET 支持目前 .NET 支持的所有主流的操作系统和平台。

因为 SliverLight 和 Windows Phone 已死，所以 Hprose 3.0 for .NET 不再提供对它们的支持。