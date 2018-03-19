---
title: 几个有用的 PowerShell 脚本
date: 2018-03-19 10:04:00
categories: [编程, PowerShell]
tags: [powershell]
---

前一篇文章介绍了如何美化 PowerShell，今天来写几个比较实用的 PowerShell 脚本。

<!-- more -->

# 通过 cd... 进入上上级目录

在命令行里我们最常用的命令应该就是 `cd` 了，因为每次切换目录都要用到。不过如果进入了比较深的目录，想要向上退几层的话，对于我这种懒人来说，要输入 `cd ..\..` 这样的命令感觉太麻烦了。要是能支持 `cd...` 或者 `cd ...` 这样的写法就简单多了。

要实现 `cd...` 这样的写法很简单，只需要编写下面这样的脚本就可以了：

```powershell cd...
function cd... { Set-Location ..\.. }
function cd.... { Set-Location ..\..\.. }
function cd..... { Set-Location ..\..\..\.. }
function cd...... { Set-Location ..\..\..\..\.. }
function cd....... { Set-Location ..\..\..\..\..\.. }
function cd........ { Set-Location ..\..\..\..\..\..\.. }
function cd......... { Set-Location ..\..\..\..\..\..\..\.. }
```

如果你愿意的话，可以定义更长的函数。

如果希望 `cd` 和 `...` 之间有空格也好用的话，那就稍微复杂一些了，不过也是可以实现的：

```powershell 增强型 cd
function Set-CurrentWorkingDirectory
{
    param
    (
        $Path,
        $LiteralPath,
        $PassThru,
        $StackName,
        $UseTransaction
    )
    if ($Path -and ($Path.Contains('...')))
    {
        $a = [System.Text.RegularExpressions.Regex]::Split($Path, "(\.{3,})");
        for ($i = 0; $i -lt $a.Length; $i++)
        {
            $e = $a[$i];
            $l = $e.Length;
            if (($l -gt 2) -and ($e -eq "".PadRight($l, '.')))
            {
                $a[$i] = ".." + [System.String]::Concat([System.Linq.Enumerable]::Repeat("\..", $l - 2))
            }
        }
        $PSBoundParameters['Path'] = [System.String]::Concat($a)
    }
    return Set-Location @PSBoundParameters
}

Set-Alias cd Set-CurrentWorkingDirectory -Option "AllScope"
```

上面这段代码定义了一个 `Set-CurrentWorkingDirectory` 函数，它做的事情很简单，就是把路径中的 `...` 都替换成 `..\..` 的形式，然后再传给 Set-Location。

其中 `...` 可以是任意长度，比如 `....` 或 `............................` 都可以，只要你真的需要这么长的路径。

路径中间的 `...` 也可以被替换，例如：`D:\Git\CoolCode\themes\indigo\source\....\source`，会被替换为`D:\Git\CoolCode\themes\indigo\source\..\..\..\source`。

好了，现在把上面两段代码加入到：

> C:\Users\andot\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
> C:\Users\andot\Documents\WindowsPowerShell\Microsoft.VSCode_profile.ps1

中，然后再启动 PowerShell 就可以使用这个增强版的 `cd` 命令了。

注意，我这里没有替换 `chdir` 这个别名。因为 PowerShell 是跨平台的，在 Linux 上是可以建立 `...` 这样名字的目录的，所以，如果真的是要进入这样的目录，而不是上退两层目录的话，至少还可以使用 `chdir` 这个别名。Windows 上就无所谓了，因为 Windows 上无法创建这样的目录，也无法正常进入已存在的这样的目录。

# 还原 Linux 风格的 ls，ll，la 命令

`ls` 命令在 Linux 上的行为默认只是把文件名列出来，而 PowerShell 上的 `ls` 是以列表的形式列出文件详情列表。如果只想看文件名，还要用 `ls | Format-Wide -AutoSize` 这样的方式，感觉甚是麻烦。另外，在 Linux 上一般也会自定义 `ll`、`la` 这样的别名，比如 `ll` 会以列表形式显示文件详情，`la` 会列出包含隐藏文件在内的所有文件。下面的代码就是用来还原这种 Linux 风格操作的，另外，我还在其中加了一个 `lla` 别名，什么功能看名字应该就能猜出来吧。

```powershell 还原 Linux 风格的 ls，ll，la 命令
function Get-ChildItem-Wide
{
    param
    (
        $Path,
        $LiteralPath,
        $Filter,
        $Include,
        $Exclude,
        $Recurse,
        $Force,
        $Name,
        $UseTransaction,
        $Attributes,
        $Depth,
        $Directory,
        $File,
        $Hidden,
        $ReadOnly,
        $System
    )
    Get-ChildItem @PSBoundParameters | Format-Wide -AutoSize
}

function Get-ChildItem-All
{
    param
    (
        $Path,
        $LiteralPath,
        $Filter,
        $Include,
        $Exclude,
        $Recurse,
        $Force,
        $Name,
        $UseTransaction,
        $Attributes,
        $Depth,
        $Directory,
        $File,
        $Hidden,
        $ReadOnly,
        $System
    )
    if ($Attributes)
    {
        $PSBoundParameters.Remove('Attributes');
    }
    Get-ChildItem -Attributes ReadOnly, Hidden, System, Normal, Archive, Directory, Encrypted, NotContentIndexed, Offline, ReparsePoint, SparseFile, Temporary @PSBoundParameters
}

function Get-ChildItem-All-Wide
{
    param
    (
        $Path,
        $LiteralPath,
        $Filter,
        $Include,
        $Exclude,
        $Recurse,
        $Force,
        $Name,
        $UseTransaction,
        $Attributes,
        $Depth,
        $Directory,
        $File,
        $Hidden,
        $ReadOnly,
        $System
    )
    Get-ChildItem-All @PSBoundParameters | Format-Wide -AutoSize
}

Set-Alias ls Get-ChildItem-Wide -Option "AllScope"
Set-Alias ll Get-ChildItem
Set-Alias lla Get-ChildItem-All
Set-Alias la Get-ChildItem-All-Wide
```

# 用 which 来查找命令的默认路径

Linux 上有个 `which` 命令，它的作用是，在 PATH 变量指定的路径中，搜索某个系统命令的位置，并且返回第一个搜索结果。也就是说，使用 `which` 命令，就可以看到某个系统命令是否存在，以及执行的到底是哪一个位置的命令。

下面的代码还原了 `which` 命令的用法：

```powershell which
function which
{
    $results =New-Object System.Collections.Generic.List[System.Object];
    foreach ($command in $args)
    {
        $path = (Get-Command $command).Source
        if ($path)
        {
            $results.Add($path);
        }
    }
    return $results;
}
```

用法：

```sh
which bash notepad
```

输出：

```
C:\Windows\System32\bash.exe
C:\Windows\System32\notepad.exe
```

which 后面可以指定多个需要查找的命令。

# 用 killall 杀死指定名字的所有进程

```powershell killall
function killall
{
    $commands = Get-Process $args
    foreach ($command in $commands)
    {
        Stop-Process $command.Id
    }
}
```

用法：

```sh
killall notepad cmd
```

killall 后面可以指定多个进程名。