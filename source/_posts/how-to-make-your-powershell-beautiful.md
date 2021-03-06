---
title: PowerShell 美化指南
date: 2018-03-16 21:14:45
updated: 2018-03-18 10:02:31
categories: [编程, PowerShell]
tags: [powershell]
---

因为最近开始 Hprose 2.0 for .NET 的开发工作了，所以使用的操作系统从 Mac OS X 转到了 Windows 10 上来。在之前用 Mac OS X 和 Linux 时，命令行是经常用到的，转到 Windows 10 上之后，虽然大部分操作通过图形界面都可以完成了，但是有些操作还是会用到命令行，但是 Windows 10 的默认命令行控制台实在是丑的要命，让人感觉不爽。所以，我最后打算先把 Windows 10 的控制台美化一下，接下来工作时，也会变得心情舒畅。

<!-- more -->

先晒一下美化之后的成果：

![ScreenFetch](screenfetch.png)
![控制台颜色配置](Show-Colors.png)
![主题颜色配置](Show-ThemeColors.png)
![带有git状态的命令行提示符](git.png)

怎么样？看了之后，你要是没兴趣，就可以忽略下面的内容了。要是感兴趣的话，那我们就开始吧。

# 装逼利器 ScreenFetch 的安装

在正式开始之前，先装个逼。

上面第一张截图中使用的 screenfetch 并不是在 WSL 中安装的，也不是 Cygwin 或 MinGW 下面的版本，而是一个 PowerShell 模块 [Windows-screenFetch](https://github.com/JulianChow94/Windows-screenFetch)，你只需要在 PowerShell 控制台中使用：

```powershell
Install-Module windows-screenfetch -Scope CurrentUser
```

就可以安装它了。

如果在安装过程中遇到类似于这样的提示：

```
不受信任的存储库
你正在从不受信任的存储库安装模块。如果你信任该存储库，请通过运行 Set-PSRepository
cmdlet 更改其 InstallationPolicy 值。是否确实要从“PSGallery”安装模块?
[Y] 是(Y)  [A] 全是(A)  [N] 否(N)  [L] 全否(L)  [S] 暂停(S)  [?] 帮助
```

你可以按 <kbd>Y</kbd> 或 <kbd>A</kbd> 键，但是如果你觉得每次都这样麻烦的话，可以先执行下面的命令：

```powershell
Set-PSRepository -Name PSGallery -InstallationPolicy Trusted
```

之后再安装模块就不会出现这个提示了。

现在，你可以直接使用 `screenfetch` 命令了。

如果你在执行 `screenfetch` 遇到以下错误：

```
screenfetch : 在模块“windows-screenfetch”中找到“screenfetch”命令，但无法加载该模
块。有关详细信息，请运行“Import-Module windows-screenfetch”。
所在位置 行:1 字符: 1
+ screenfetch
+ ~~~~~~~~~~~
    + CategoryInfo          : ObjectNotFound: (screenfetch:String) [], CommandNotFou
   ndException
    + FullyQualifiedErrorId : CouldNotAutoloadMatchingModule
```

你可能会试着去执行：

```powershell
Import-Module windows-screenfetch
```

然而可能并没有什么用，接下来你可能会看到新的错误：

```
Import-Module : 无法加载文件 C:\Users\andot\Documents\WindowsPowerShell\Modules\windo
ws-screenfetch\1.0.2\Art.psm1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https
:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
所在位置 行:1 字符: 1
+ Import-Module windows-screenfetch
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : SecurityError: (:) [Import-Module]，PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess,Microsoft.PowerShell.Commands.Impor
   tModuleCommand
```

没关系，不要急，只要执行：

```powershell
Set-ExecutionPolicy -Scope CurrentUser Bypass
```

然后选 <kbd>A</kbd> 就可以了。

接下来再执行 `screenfetch` 就可以看到类似于第一张截图的结果了，是不是很酷。

# Windows 10 控制台的字体配置

什么？一点都不酷，跟截图上的一点都不像，简直丑爆了，是吗？

嗯，那是因为 Windows 控制台在中文系统下，默认是新宋体，如果显示器不是高分屏，字体设置的又不是很大，正好是点阵显示的话，效果还是不错的。然而很不巧，我用的 iMac 27 是 Retina 高分屏，所以，新宋体在控制台下就变得惨不忍睹了。差不多就是下图这样的效果吧。

![默认新宋体下显示ScreenFetch的效果](ScreenFetchWithNSimSun.png)

不只是汉字不好看，英文更是难看。在默认的{% ruby 代码页|CodePage %} {% ruby GBK|936 %} 下面可选的字体不多，只有几个汉字字体和两个日文字体。那些汉字字体在控制台下面没有一个好看的，日文字体更是没法看。如果用：

```cmd
chcp 65001
```

切换到 {% ruby UTF-8|65001 %} 的{% ruby 代码页|CodePage %}，会多出几个可选的英文字体，其中 `Consolas` 这个字体看上去倒还可以，不过汉字仍然是新宋体，还是不够完美，差不多是这样的效果吧：

![Consolas下显示ScreenFetch的效果](ScreenFetchWithConsolas.png)

之前在 Linux 下使用 VSCode 时，使用过一款 [{% ruby 更纱黑体|Sarasa-Gothic %}](https://github.com/be5invis/Sarasa-Gothic)，感觉非常不错。当时选择这款字体的原因是，在 Linux 下使用 VSCode 时， 如果使用其它的汉字等宽字体，比如“文泉驿等宽正黑”、“文泉驿等宽微米黑”，或者使用一些比较好看的英文等宽字体配合这些汉字字体时，普通的空格会变成占 2 个字符的宽度。这样的话，代码排版就乱了。但是如果换成这款汉字字体，不但等宽问题解决了，而且这款字体还相当漂亮，不论是用于代码编写还是控制台，都是非常合适。于是果断安装这款字体到 Windows 10 上，然后在 Windows 10 的 PowerShell 控制台选中它：

![选择Sarasa Term SC](SarasaTermSC.png)

然后就能看到本文最开始的那幅图的效果了。而且这款字体已经内置了 PowerLine 字体，后面我们安装 PowerLine 效果的命令行提示符时，就不需要再装任何其它的 PowerLine 字体了。

到这里，字体配置已经完成一大半了。但是如果你使用 WSL，并且在 WSL 里面配置了 PowerLine 命令提示符的话，你会发现，在进入 Git 目录时会看到命令提示符中有个“□”：

![字体中的乱码](WSL1.png)

这个是个表情符“✎”，但是因为 Sarasa 系列字体中不包含表情符，因此就只能显示乱码了。不过也有解决办法，打开注册表编辑器，找到路径：

```reg
计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\FontLink\SystemLink
```

在其中新建多字符串值，名称为：`Sarasa Term SC`，内容为：

```reg
MICROSS.TTF,Microsoft Sans Serif,108,122
MICROSS.TTF,Microsoft Sans Serif
MINGLIU.TTC,PMingLiU
MSMINCHO.TTC,MS PMincho
BATANG.TTC,Batang
MSYH.TTC,Microsoft YaHei UI
MSJH.TTC,Microsoft JhengHei UI
YUGOTHM.TTC,Yu Gothic UI
MALGUN.TTF,Malgun Gothic
SEGUISYM.TTF,Segoe UI Symbol
```

这段内容是复制的{% ruby 宋体|SimSun %}的，如果你愿意的话，可以用同样的方法把 `Sarasa` 系列的都注册一下，如果像我这么懒的话，只修改这一个，然后重启计算机也是可以了。修改之后的效果是这样的：

![没有乱码了](WSL2.png)

# Windows 10 控制台的颜色设置

字体问题解决了之后，接下来就是控制台的配色问题了。很多人放弃使用 Windows 的控制台，转而使用 ConEmu，Cmder 等第三方控制台程序，就是因为 Windows 控制台默认的配色太难看了。

但是实际上，Windows 10 的控制台的配色也是可以改的，很久之前 Windows 10 的控制台就已经支持 24 位真彩色，而且控制台也可以设置透明度，所以 Windows 10 的控制台完全可以配置的很酷炫。

但是很多人不知道该怎么对 Windows 10 的控制台进行配色，我也是从网上搜索了好久才找到了微软提供的这个[配色工具](https://github.com/Microsoft/console/releases)，而且它还是开源的。

它的使用方式很简单，下载之后，解压缩，不需要安装，在解压缩的目录下面打开命令行（或者把解压缩的目录加入到 PATH 环境变量中），然后执行：

```cmd
colortool -b campbell
```

然后会看到下图：

![ColorTool](colortool.png)

接下来在标题栏点击右键（或者单击标题栏左边的图标），在弹出菜单里面选最后一项属性，之后什么都不用做，直接点击确定，就可以把当前控制台和默认控制台的配色方案切换 campbell 主题了。下载包里自带了 8 款配色主题。其中 3 款是 ini 格式的，另外 5 款是 itermcolors 格式的。说实话，自带的这几款配色我都不是很喜欢，不过还好，我们可以从 [iTerm2 Color Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) 这里挑选我们喜欢的配色主题。

不过从 [iTerm2 Color Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) 的配色方案实在是太多了，选起来本身也是个麻烦事，我最后在这几款中选出了下面这几款配色，感觉还不错，推荐给大家：

* [ayu](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/ayu.itermcolors)
* [Molokai](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Molokai.itermcolors)
* [Cobalt2](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Cobalt2.itermcolors)
* [Pandora](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Pandora.itermcolors)
* [ThayerBright](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Thayer%20Bright.itermcolors)
* [Symfonic](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Symfonic.itermcolors)
* [RedSands](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Red%20Sands.itermcolors)
* [Mathias](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Mathias.itermcolors)

我这样选择理由是，在这几款配色下，文字识别度都比较好，我我个人最喜欢的是 ayu，其次是 Molokai。尤其是 ayu，在控制台上的文字辨识度感觉比使用 ConEmu，Cmder 带的配色还要好，而且色彩上也比较柔和。话说前面最初晒的 4 幅图片都是在 ayu 主题下的效果，这里就不再重复贴图了。

# PowerShell 的彩色文件列表

虽然控制台的配色问题解决了，但是在默认情况下， PowerShell 的文件列表并不会彩色显示。

想要文件列表彩色显示的话，最简单的方法就是安装一个 PowerShell 模块：[PSColor](https://github.com/Davlind/PSColor)。

这个模块安装使用都很简单，打开 Windows PowerShell 管理员控制台，输入：

```powershell
Install-Module PSColor
```

就可以了。

如果你想使用普通用户来安装，打开 WIndows PowerShell 控制台，输入：

```powershell
 Install-Module PSColor -Scope CurrentUser
 ```

当然安装完了之后，直接输入 ls，显示的还是黑白效果的文件列表，你还需要启动它，不论是在管理员控制台，还是普通用户控制台下，都可以直接输入：

```powershell
Import-Module PSColor
```

来导入该模块。之后，再输入 ls 就可以看到彩色文件列表了，如图：

![PSColor彩色文件列表](PSColor.png)

哪些文件类型可以被加亮显示是可以配置的，在 [PSColor](https://github.com/Davlind/PSColor) 官方的 README 中有介绍，这里就不转述了。不过这个配置方式是 PowerShell 式的，如果能直接像上面使用 itermcolors 文件配置控制台色彩一样，直接用 Linux 平台上的现成的 dircolors 配置文件的话，会不会更方便呢？这个想法很好，而且还真的有人实现了，它就是 [DirColors](https://github.com/DHowett/DirColors)。

这也是一个 PowerShell 模块，安装方式跟 [PSColor](https://github.com/Davlind/PSColor) 一样，使用：

```powershell
Install-Module DirColors
```

或者

```powershell
Install-Module DirColors -Scope CurrentUser
```

就可以安装上了。之后，使用：

```powershell
Import-Module DirColors
```

导入该模块。接下来，如果你想要载入某个现成的 dircolors 配置文件的话，只需要用：

```powershell
Update-DirColors ~\dir_colors
```

这条命令就可以了。

其中 `~\dir_colors` 就是配置文件的路径，关于 dir_colors 的配置文件，在 github 上可以搜到不少，比如：[dircolors-solarized](https://github.com/seebi/dircolors-solarized)。这里就不再列举更多了。

# PowerShell 的 PowerLine 提示符

用过 Mac OS X 的同学，大部分应该都知道 [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) 这个玩意，它是一个改进命令行体验的工具，安装之后，会让你的命令行操作爽的停不下来。

PowerShell 上也有一个类似的模块，叫 [oh-my-posh](https://github.com/JanJoris/oh-my-posh)。因为它的 git 命令提示符部分依赖 [post-git](https://github.com/dahlbyk/posh-git)，所以这两个模块都要安装：

```powershell
Install-Module posh-git -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser
```

安装完之后，要想使用，还需要安装 [git for windows](https://git-scm.com/)，普通版和 Portable 版本都可以，但是需要把安装之后的可执行文件目录加到 PATH 中。

之后直接执行：

```powershell
Import-Module posh-git
Import-Module oh-my-posh
Set-Theme PowerLine
```

就可以加载模块和 PowerLine 主题了。

如果你觉得每次启动这些模块都要手动输入很麻烦的话，可以编辑：

> C:\Users\andot\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1

这个文件。

把下列代码加入即可：

```powershell
Import-Module DirColors
Update-DirColors ~/dircolors
Import-Module posh-git
if (!(Get-SshAgent)) {
    Start-SshAgent
}
Import-Module oh-my-posh
Set-Theme PowerLine
Screenfetch
```

这样启动控制台之后就可以看到这个画面了：

![ScreenFetch](screenfetch.png)

如果你想在 VSCode 的控制台上也能使用的话，可以把上面的代码加入到：

> C:\Users\andot\Documents\WindowsPowerShell\Microsoft.VSCode_profile.ps1

中，然后打开 VSCode 的控制台时，VSCode 的 PowerShell 控制台也会自动执行这些脚本，效果如下：

![VSCode 下的 PowerShell 控制台](screenfetchOnVSCode.png)

上面这一段代码中，最后一句 `Screenfetch` 会占用比较长的时间，如果你不想每次点开控制台都要等上几秒钟的话，可以不要这一句，只是效果不够装逼了而已。

安装了 oh-my-posh 之后，命令行操作爽多了，但是还有一个问题未解决。

如果把控制台{% ruby 代码页|CodePage %}切换到 {% ruby UTF-8|65001 %} 的情况下，在 PowerShell 命令行中输入汉字的话，汉字、日文、表情符等非英文字符会有重叠问题，如果按 Tab 键，在下面出现的提示补全信息中的汉字、日文、表情符等也会出现重叠问题。开始我以为这是 Windows 控制台的锅，后来发现 WSL 下并不会有这个问题。然后经过搜索，确认这是 PowerShell 的 Bug，目前虽然有人提供了补丁，但是官方似乎没有合并的意思：

> https://github.com/PowerShell/PowerShell/pull/5739

另外，就算 github 上这个 PowerShell 项目把这个问题解决了，它跟 Windows 10 中自带的 PowerShell 也不是一回事。从 Github 上下载安装的这个 PowerShell 是一个独立的版本，安装之后，跟 Windows 10 自带的那个 PowerShell 是并存的，并不是升级替换。

不过还好，这个问题目前也有解决的方法，那就是升级 Windows 10 的 PowerShell 自带的 [PSReadLine](https://www.powershellgallery.com/packages/PSReadline/2.0.0-beta1) 模块到最新的 2.0.0-beta1 版，最新的 2.0.0-beta1 版本已经把这个问题基本解决了，虽然还是不够完美，但是比没完全解决的时候还是好多了。不过升级 PSReadLine 之前，还要先升级 Windows 10 自带 [PowerShellGet](https://www.powershellgallery.com/packages/PowerShellGet/1.6.0) 模块到最新版，因为自带的版本不支持安装 beta 版的 PSReadLine (lll￢ω￢)。安装过程倒不复杂，打开 PowerShell 管理员控制台，执行：

```
Install-Module -Name PowerShellGet -Force
Install-Module -Name PSReadLine -AllowPrerelease -Force
```

然后重启 PowerShell 控制台，就可以在 PowerShell 命令行里正常输入汉字了。

好了，今天就先写到这里，明天再写如何配置让 PowerShell 变得更好用。