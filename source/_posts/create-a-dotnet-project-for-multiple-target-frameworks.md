---
title: 创建面向多目标框架的.NET项目
date: 2018-03-26 12:10:55
updated: 2020-01-01 15:55:37
categories: [编程,.NET]
tags: [c#]
---
之前在开发 hprose for .NET 时，因为老版本的 Visual Studio 不支持创建面向多个目标框架的 .NET 项目，所以只能在一个 .NET 工程下面为每个目标框架的 .NET 版本创建一个 csproj 项目文件，费时又费力。所以我甚至一度抛弃创建 .NET 工程项目，用编写 bat 文件的命令行方式来编译 hprose for .NET 的 dll 类库。

现在要开发 hprose 3.0 for .NET 时，我希望能够在这方面省点事，毕竟现在的 .NET 跟之前比起来，版本更多了，而且还增加了许多跨平台的目标框架，如果还用 bat 的方式来编译打包，想一想都是很头疼的事情。

 微软估计也考虑到了这一点，所以现在终于在 Visual Studio 2017/2019 中提供了一种新的 csproj 格式，使用这种格式，就可以创建面向多个目标框架的 .NET 项目了。这对于开发多目标框架的 .NET 库来说，无疑是提供了很大的便利。

 <!--more-->

# 创建新版本的 .csproj 项目文件

 如果使用 .NET Core 2.0 命令行创建的话，非常简单，新建一个项目目录，然后在其中执行：

 ```cmd
 dotnet new classlib
 ```

 就可以了。

 如果使用 Visual Studio 2017/2019 的话，选择新建项目，然后选择 .NET Core 或者 .NET Standard，之后选择类库，就可以了，如图：

![创建 .NET Core 类库](create-netcoreapp-library-in-vs2017/2019.png)

 新创建的 .csproj 项目文件，可以直接用文本编辑器（比如 VSCode 等）打开，里面内容很简单：

 ```xml
 <Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
  </PropertyGroup>

</Project>
```

这个项目目前还只支持单一的目标框架，要改成支持多目标框架就需要来用文本编辑器手动编辑这个 XML 文件了。Visual Studio 2017 目前还不支持通过图形界面的方式来配置多目标框架。

# 改成面向多目标框架的项目

修改其实也很简单，只需要把 `TargetFramework` 改成 `TargetFrameworks`，然后把你需要的目标框架填进去，用分号分隔就行了。例如：

```xml
 <Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFrameworks>netstandard1.0;netstandard1.1;netstandard1.2;netstandard1.3;netstandard1.4;netstandard1.5;netstandard1.6;netstandard2.0;netcoreapp1.0;netcoreapp1.1;netcoreapp2.0;net40;net45;net451;net452;net46;net461;net462;net47;net471</TargetFrameworks>
  </PropertyGroup>

</Project>
```

上面这些目标框架是 .NET Core 和 Visual Studio 2017/2019 默认就支持的，只要这样写上，就可以直接用命令行：

```cmd
dotnet build
```

或在 Visual Studio 2017/2019 中编译通过。

但如果创建的不是类库，而是单元测试（mstest 和 xunit）项目的话，`netstandardx.x` 和 `net40` 就不支持了，这一点是测试框架限制的。

所以，既能编译，又能测试的多目标框架大概也就只有这些：

```xml
 <Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFrameworks>netcoreapp1.0;netcoreapp1.1;netcoreapp2.0;net45;net451;net452;net46;net461;net462;net47;net471</TargetFrameworks>
  </PropertyGroup>

</Project>
```

如果不考虑测试，那么在 Visual Studio 2017/2019 中，还可以添加上：`net20`、`net30` 和 `net35` 这三个目标框架。

这些可以在 Visual Studio 2017/2019 中可以编译通过，使用 dotnet 命令行的话，会显示：


> <span style="color: red">C:\Program Files\dotnet\sdk\2.1.4\Microsoft.Common.CurrentVersion.targets(1124,5): error MSB3644: 未找到框架“.NETFramework,Version=v2.0”的引用程序集。若要解决此问题，请安装此框架版本的 SDK 或 Targeting Pack，或将应用程序的目标重新指向已装有 SDK 或 Targeting Pack 的框架版本。请注意，将从全局程序集缓存(GAC)解析程序集，并将使用这些程序集替换引用程序集。因此，程序集的目标可能未正确指向您所预期的框架。</span>

这样的错误信息。这个问题能否解决我还不清楚，因为没有查到这方面的资料。

# 增加 NuGet 打包信息

新版的 .csproj 不但可以直接添加程序集信息，不再需要 `AssemblyInfo.cs` 这个文件了。还可以直接添加 NuGet 打包信息，一步生成 .nupkg 文件。例如：

```xml
  <PropertyGroup>
    <SignAssembly>true</SignAssembly>
    <DelaySign>false</DelaySign>
    <AssemblyOriginatorKeyFile>HproseKeys.snk</AssemblyOriginatorKeyFile>
    <Version>2.0.0</Version>
    <OutputType>Library</OutputType>
    <GeneratePackageOnBuild>true</GeneratePackageOnBuild>
    <PackageRequireLicenseAcceptance>true</PackageRequireLicenseAcceptance>
    <Authors>Ma Bingyao&lt;andot@hprose.com&gt;</Authors>
    <Company>hprose.com</Company>
    <Copyright>Copyright © http://www.hprose.com, All rights reserved.</Copyright>
    <AssemblyVersion>2.0.0.0</AssemblyVersion>
    <Product>Hprose.Core</Product>
    <PackageLicenseUrl>http://opensource.org/licenses/MIT</PackageLicenseUrl>
    <PackageProjectUrl>http://www.hprose.com</PackageProjectUrl>
    <PackageIconUrl>http://hprose.com/apple-touch-icon-180x180.png</PackageIconUrl>
    <RepositoryUrl>https://github.com/hprose/hprose-dotnet</RepositoryUrl>
    <RepositoryType>git</RepositoryType>
  </PropertyGroup>
```

上面的信息对于所面向的不同框架信息都是一样的，还可以根据不同的框架来添加不同的信息，例如：

```xml
  <Target Name="PreBuild" BeforeTargets="PreBuildEvent">
    <PropertyGroup Condition=" '$(TargetFrameworkIdentifier)' != '' ">
      <Product>Hprose.Core for $(TargetFrameworkIdentifier) $(TargetFrameworkVersion)</Product>
    </PropertyGroup>
    <PropertyGroup Condition=" '$(TargetFrameworkProfile)' != '' ">
      <Product>Hprose.Core for $(TargetFrameworkIdentifier) $(TargetFrameworkVersion) $(TargetFrameworkProfile) Profile</Product>
    </PropertyGroup>
  </Target>
```

通过上面这一段代码，就可以为生成的每个 dll 添加不同的产品名称信息了。

# 为不同目标框架的增加预编译符号

要用一套代码为不同的目标框架来编写类库，那么条件编译是不可或缺的。

Java 没有提供条件编译，要实现这一目标就变得非常困难，目前虽然在 Java 中能借助 `final` 变量加 `if` 条件判断来实现有限的“条件编译”，但是 Java 的这种奇技淫巧跟 C# 提供的条件编译比起来，简直难用的要死。尤其是现在 Java 也成了版本帝，半年一个就发布一个版本，在这种情况下，还不提供条件编译，这简直是类库开发者的噩梦。

C# 从一开始就支持条件编译，不过最初并没有为每个不同版本的框架定义标准的预编译符号。但是现在，使用新版的 .csproj 创建的项目，会自动为不同版本的目标框架添加预编译符号了，下面是自动添加的预编译符号：

|       目标框架       |    预编译符号    |
|:---------------------|:-----------------|
| .NET Framework 2.0   | `NET20`          |
| .NET Framework 3.0   | `NET30`          |
| .NET Framework 3.5   | `NET35`          |
| .NET Framework 4.0   | `NET40`          |
| .NET Framework 4.5   | `NET45`          |
| .NET Framework 4.5.1 | `NET451`         |
| .NET Framework 4.5.2 | `NET452`         |
| .NET Framework 4.6   | `NET46`          |
| .NET Framework 4.6.1 | `NET461`         |
| .NET Framework 4.6.2 | `NET462`         |
| .NET Framework 4.7   | `NET47`          |
| .NET Framework 4.7.1 | `NET471`         |
| .NET Framework 4.7.2 | `NET472`         |
| .NET Framework 4.8   | `NET48`          |
| .NET Standard 1.0    | `NETSTANDARD1_0` |
| .NET Standard 1.1    | `NETSTANDARD1_1` |
| .NET Standard 1.2    | `NETSTANDARD1_2` |
| .NET Standard 1.3    | `NETSTANDARD1_3` |
| .NET Standard 1.4    | `NETSTANDARD1_4` |
| .NET Standard 1.5    | `NETSTANDARD1_5` |
| .NET Standard 1.6    | `NETSTANDARD1_6` |
| .NET Standard 2.0    | `NETSTANDARD2_0` |
| .NET Standard 2.1    | `NETSTANDARD2_1` |
| .NET Core 1.0        | `NETCOREAPP1_0`  |
| .NET Core 1.1        | `NETCOREAPP1_1`  |
| .NET Core 2.0        | `NETCOREAPP2_0`  |
| .NET Core 2.1        | `NETCOREAPP2_1`  |
| .NET Core 2.2        | `NETCOREAPP2_2`  |
| .NET Core 3.0        | `NETCOREAPP3_0`  |
| .NET Core 3.1        | `NETCOREAPP3_1`  |

如果感觉不够用，还可以自己添加，例如：

```xml
  <PropertyGroup Condition=" $(TargetFramework.Contains('netstandard1.')) ">
		<_IsNetStandard1Defined>$([System.Text.RegularExpressions.Regex]::IsMatch('$(DefineConstants.Trim())', '(^|;)NETSTANDARD1($|;)'))</_IsNetStandard1Defined>
		<DefineConstants Condition="!$(_IsNetStandard1Defined)">NETSTANDARD1;$(DefineConstants)</DefineConstants>
  </PropertyGroup>

  <PropertyGroup Condition=" $(TargetFramework.Contains('netcoreapp1.')) ">
		<_IsNetCoreApp1Defined>$([System.Text.RegularExpressions.Regex]::IsMatch('$(DefineConstants.Trim())', '(^|;)NETCOREAPP1($|;)'))</_IsNetCoreApp1Defined>
		<DefineConstants Condition="!$(_IsNetCoreApp1Defined)">NETCOREAPP1;$(DefineConstants)</DefineConstants>
  </PropertyGroup>
```

这样就可以为 .NET Standard 1.x 增加预编译符号 `NETSTANDARD1`，为 .NET Core 1.0 增加预编译符号 `NETCOREAPP1` 了。这对于在程序中只需要一个条件就可以判断所有的 .NET Standard 1.x 平台或 .NET Core 1.x 平台了。

# 添加 Android 平台支持

默认情况下，使用 Visual Studio 2017/2019 创建的 Android 类库项目是不使用这个新版本 .csproj 格式的。不过我们可以手动把 Android 平台添加到已有的这个项目中。

首先在 `<TargetFrameworks>...</TargetFrameworks>` 里面加入 `monoandroid71`。其中 `monoandroid` 是目标框架标识，`71` 是目标框架版本号。然后加入下列代码：

```xml
  <PropertyGroup Condition=" $(TargetFramework.Contains('monoandroid')) ">
    <FileAlignment>512</FileAlignment>
    <GenerateSerializationAssemblies>Off</GenerateSerializationAssemblies>
    <AndroidUseLatestPlatformSdk>true</AndroidUseLatestPlatformSdk>
    <TargetFrameworkVersion>v$(TargetFramework[11]).$(TargetFramework[12])</TargetFrameworkVersion>
    <TargetFrameworkIdentifier>MonoAndroid</TargetFrameworkIdentifier>
    <LanguageTargets>$(MSBuildExtensionsPath)\Xamarin\Android\Xamarin.Android.CSharp.targets</LanguageTargets>
  </PropertyGroup>

  <ItemGroup Condition=" $(TargetFramework.Contains('monoandroid')) ">
    <Reference Include="Mono.Android" />
  </ItemGroup>
```

Android 目标框架有好几个版本，我目前还不确定是否只添加最高版本的就能在所有版本上都可以使用，如果不行的话，那就把所有版本（`monoandroid44`;`monoandroid50`;`monoandroid51`;`monoandroid60`;`monoandroid71`）都添加进去也无妨。

# 添加 Apple 系列平台支持

添加方法跟 Android 平台类似。首先在 `<TargetFrameworks>...</TargetFrameworks>` 里面加入 `xamarinmac20;xamarinios10;xamarintvos10;xamarinwatchos10`。然后加入下列代码：

```xml
<PropertyGroup Condition=" '$(TargetFramework)' == 'xamarinmac20' ">
    <TargetFrameworkVersion>v2.0</TargetFrameworkVersion>
    <TargetFrameworkIdentifier>Xamarin.Mac</TargetFrameworkIdentifier>
  </PropertyGroup>

  <PropertyGroup Condition=" '$(TargetFramework)' == 'xamarinios10' ">
    <TargetFrameworkVersion>v1.0</TargetFrameworkVersion>
    <TargetFrameworkIdentifier>Xamarin.iOS</TargetFrameworkIdentifier>
  </PropertyGroup>

  <PropertyGroup Condition=" '$(TargetFramework)' == 'xamarintvos10' ">
    <TargetFrameworkVersion>v1.0</TargetFrameworkVersion>
    <TargetFrameworkIdentifier>Xamarin.TVOS</TargetFrameworkIdentifier>
  </PropertyGroup>

  <PropertyGroup Condition=" '$(TargetFramework)' == 'xamarinwatchos10' ">
    <TargetFrameworkVersion>v1.0</TargetFrameworkVersion>
    <TargetFrameworkIdentifier>Xamarin.WatchOS</TargetFrameworkIdentifier>
  </PropertyGroup>

  <PropertyGroup Condition=" $(TargetFramework.Contains('xamarin')) ">
    <LanguageTargets>$(MSBuildExtensionsPath)\$(TargetFrameworkIdentifier.Replace('.', '\'))\$(TargetFrameworkIdentifier).CSharp.targets</LanguageTargets>
  </PropertyGroup>

  <ItemGroup Condition=" $(TargetFramework.Contains('xamarin')) ">
    <Reference Include="$(TargetFrameworkIdentifier)" />
  </ItemGroup>
```

# 添加 SliverLight 平台支持

在 `<TargetFrameworks>...</TargetFrameworks>` 里面加入 `sl3;sl4;sl5`。然后加入下列代码：

```xml
  <PropertyGroup Condition=" $(TargetFramework.StartsWith('sl')) ">
    <_SilverLightVersion>$(TargetFramework[2])</_SilverLightVersion>
    <TargetFrameworkVersion>v$(_SilverLightVersion).0</TargetFrameworkVersion>
    <TargetFrameworkIdentifier>SilverLight</TargetFrameworkIdentifier>
    <SilverlightVersion Condition="'$(SilverlightVersion)' == ''">$(TargetFrameworkVersion)</SilverlightVersion>
    <SilverlightApplication>false</SilverlightApplication>
    <ValidateXaml>true</ValidateXaml>
    <DisableImplicitFrameworkReferences>true</DisableImplicitFrameworkReferences>
		<_IsSilverLightDefined>$([System.Text.RegularExpressions.Regex]::IsMatch('$(DefineConstants.Trim())', '(^|;)SILVERLIGHT($|;)'))</_IsSilverLightDefined>
		<DefineConstants Condition="!$(_IsSilverLightDefined)">SILVERLIGHT;SILVERLIGHT$(_SilverLightVersion);$(DefineConstants)</DefineConstants>
    <LanguageTargets>$(MSBuildProgramFiles32)\MSBuild\Microsoft\$(TargetFrameworkIdentifier)\$(TargetFrameworkVersion)\Microsoft.$(TargetFrameworkIdentifier).CSharp.targets</LanguageTargets>
  </PropertyGroup>
```

# 其它平台

.NET Compact Framework, .NET Micro Framwork, Windows Phone 这几个平台目前还没有研究，因为在 hprose 3.0 for .NET 中不打算支持它们了。其实 .NET 2.0、3.0、3.5 这几个版本的 .NET 框架以及 SliverLight 平台我也不打算在 hprose 3.0 中支持了。支持它们不但需要写大量的条件编译，而且编写代码时不能使用新特性，微软的测试框架也不支持，写起代码来太不爽了。

UWP（uap）这个平台我还不知道怎么配置到这个多目标框架的 .csproj 项目中，试了好久，都没有成功，也许还不支持吧。