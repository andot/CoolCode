---
title: lolcat in PowerShell
date: 2018-03-24 12:09:00
categories: [编程, PowerShell]
tags: [PowerShell]
---

这两天测试 PowerShell 环境，顺便写了一个小程序 `lolcat` 用来检测 Windows 控制台是否支持 24 位色，这个程序原版是 ruby 写的，用来以彩虹色显示文本。它还有一些其它语言的移植，比如 python，c，js，rust，go 等。不过都不太适合在 PowerShell 环境下运行，一是需要安装运行环境，或者需要自己编译，这一点倒还好说，只是比较麻烦而已。第二点就比较致命了，PowerShell 的管道传递的是对象，而其它语言实现的版本，只能处理文本，所以如果在 PowerShell 中使用其它语言实现的 `lolcat` 跟管道结合使用的话，要么显示的不是你想要的东西，要么干脆就挂掉了。所以，我花了两天时间写了这个 PowerShell 的版本。它可以工作在 Windows 10 自带的 PowerShell 环境下，也可以工作在跨平台的 PowerShell 6.0+ 环境下。

项目地址是：[https://github.com/andot/lolcat](https://github.com/andot/lolcat)，欢迎大家点赞~

<!--more-->

它的安装方式很简单，在 PowerShell 控制台下运行：

```powershell
Install-Module lolcat -Scope CurrentUser
```

或者在 PowerShell 管理员控制台下运行：

```powershell
Install-Module lolcat
```

就可以了。

下面是这个程序的运行截图：

![lolcat in PowerShell](screenshot.png)

![lolcat in VSCode](lolcat-in-vscode.png)

通过上面的截图我们可以看出，Windows 10 的控制台确实是支持 24 位色的，而 VSCode 内嵌的终端则不支持 24 位色。

之前一直奇怪为啥 WSL 在控制台上运行的时候，PowerLine 提示符就显示的好好的，而到了 VSCode 终端下，PowerLine 提示符中的路径分隔符就显示不出来了。现在终于明白了，原来是 VSCode 内嵌终端不支持 24 位色，而 PowerLine 提示符中的路径分隔符所使用的颜色跟背景色比较相近，VSCode 直接把它按照背景色显示了，所以就看不见了。