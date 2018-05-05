---
title: Hprose 2.0 for .NET 的序列化为何这么快
date: 2018-05-05 11:33:00
updated: 2018-05-05 13:51:00
categories: [编程, Hprose]
tags: [hprose, .net, c#]
---

经过一个多月的开发，Hprose 2.0 for .NET 的序列化反序列化部分终于基本上完成了。

这次升级是完全重写了 Hprose for .NET 的代码。

之前的 Hprose 1.x for .NET 兼容 .NET 所有的平台版本，包括 .NET Framework 、.NET Compact Framework、.NET Micro Framework、SilverLight、Windows Phone、Mono、.NET Core 等。

这次升级取消了对一些过时的 .NET 平台的支持。仅保留了对 .NET 4.0+、.NETStandard 2.0、.NET Core 2.0+、Android、iOS、Mac 平台的支持。

这次升级后的代码，使用了最新版本的 C# 的语法来编写，代码在可读性和性能上较之之前的版本都有了极大的改进。

下面我们就来看看 Hprose 2.0 for .NET 序列化究竟有多快。

首先来看一下对象数组序列化反序列化性能对比，测试代码为：[BenchmarkObjectSerialize.cs](https://github.com/andot/hprose-dotnet/blob/master/tests/Hprose.Benchmark/IO/Serializers/BenchmarkObjectSerialize.cs)，测试结果如下表所示：

{% echarts 400 '85%' %}
{
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        }
    },
    legend: {
        data: [".NET Framework 4.7.1 序列化", ".NET Framework 4.7.1 反序列化", ".NET Core 2.0.7 序列化", ".NET Core 2.0.7 反序列化", "Mono 5.4.0 序列化", "Mono 5.4.0 反序列化"],
        x: "center",
        y: "top",
        selectedMode: "multiple"
    },
    toolbox: {
        feature: {
            dataView: {
                readOnly: true,
                show: false
            },
            magicType: {
                type: ["line", "bar", "stack", "tiled"],
                show: false
            }
        }
    },
    calculable: false,
    xAxis: [
        {
            type: "value",
            name: "时间（us）"
        }
    ],
    yAxis: [
        {
            type: "category",
            data: ["Hprose", "Newton", "DataContract"]
        }
    ],
    series: [
        {
            name: ".NET Framework 4.7.1 序列化",
            type: "bar",
            data: [1.482, 2.352, 2.955],
            stack: ".NET Framework 4.7.1"
        },
        {
            name: ".NET Framework 4.7.1 反序列化",
            type: "bar",
            data: [1.34, 3.747, 9.119],
            stack: ".NET Framework 4.7.1"
        },
        {
            name: ".NET Core 2.0.7 序列化",
            type: "bar",
            data: [1.434, 2.241, 3.017],
            stack: ".NET Core 2.0.7"
        },
        {
            name: ".NET Core 2.0.7 反序列化",
            type: "bar",
            data: [1.248, 3.711, 9.686],
            stack: ".NET Core 2.0.7"
        },
        {
            name: "Mono 5.4.0 序列化",
            type: "bar",
            data: [3.581, 4.178, 42.502],
            stack: "Mono 5.4.0"
        },
        {
            name: "Mono 5.4.0 反序列化",
            type: "bar",
            data: [3.688, 5.758, 67.104],
            stack: "Mono 5.4.0"
        }
    ],
    title: {
        text: "对象数组序列化反序列化性能对比",
        x: "center",
        y: "bottom"
    }
}
{% endecharts %}

Hprose 2.0 相对于 1.x 相比，增加了对 DataSet、DataTable 序列化和反序列化的支持。下面是 DataSet 序列化反序列化性能对比，测试代码为：[BenchmarkDataSetSerialize.cs](https://github.com/andot/hprose-dotnet/blob/master/tests/Hprose.Benchmark/IO/Serializers/BenchmarkDataSetSerialize.cs)，测试结果如下表所示：

{% echarts 400 '85%' %}
{
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        }
    },
    legend: {
        data: [".NET Framework 4.7.1 序列化", ".NET Framework 4.7.1 反序列化", ".NET Core 2.0.7 序列化", ".NET Core 2.0.7 反序列化", "Mono 5.4.0 序列化", "Mono 5.4.0 反序列化"],
        x: "center",
        y: "top",
        selectedMode: "multiple"
    },
    toolbox: {
        feature: {
            dataView: {
                readOnly: true,
                show: false
            },
            magicType: {
                type: ["line", "bar", "stack", "tiled"],
                show: false
            }
        }
    },
    calculable: false,
    xAxis: [
        {
            type: "value",
            name: "时间（us）"
        }
    ],
    yAxis: [
        {
            type: "category",
            data: ["Hprose", "Newton", "DataContract"]
        }
    ],
    series: [
        {
            name: ".NET Framework 4.7.1 序列化",
            type: "bar",
            data: [7.843, 11.061, 131.137],
            stack: ".NET Framework 4.7.1"
        },
        {
            name: ".NET Framework 4.7.1 反序列化",
            type: "bar",
            data: [23.729, 40.371, 442.490],
            stack: ".NET Framework 4.7.1"
        },
        {
            name: ".NET Core 2.0.7 序列化",
            type: "bar",
            data: [7.776, 11.192, 164.812],
            stack: ".NET Core 2.0.7"
        },
        {
            name: ".NET Core 2.0.7 反序列化",
            type: "bar",
            data: [26.891, 42.013, 483.147],
            stack: ".NET Core 2.0.7"
        },
        {
            name: "Mono 5.4.0 序列化",
            type: "bar",
            data: [14.637, 19.407, 243.184],
            stack: "Mono 5.4.0"
        },
        {
            name: "Mono 5.4.0 反序列化",
            type: "bar",
            data: [43.068, 77.235, 641.725],
            stack: "Mono 5.4.0"
        }
    ],
    title: {
        text: "DataSet 序列化反序列化性能对比",
        x: "center",
        y: "bottom"
    }
}
{% endecharts %}

从上面两个图表可以看出，虽然 Newton Json 的序列化反序列化性能跟 .NET 自带的 DataContract 相比已经高出很多，但是 Hprose 比 Newton Json 还要快 1 倍左右。这是怎么做到的呢？下面我们就来详细剖析一下。

<!--more-->

# 泛型序列化器和反序列化器

在 Hprose 1.x for .NET 中，序列化和反序列化的代码主要是在 `HproseWriter` 和 `HproseReader` 两个类中实现的。

而 Hprose 2.0 for .NET 中，序列化和反序列化的代码则分别放在 `Hprose.IO.Serializers` 和 `Hprose.IO.Deserializers` 两个名称空间下面，并且定义了两个抽象的泛型类 `Serializer<T>` 和 `Deserializer<T>` 来负责序列化和反序列化。

每种具体的数据类型的序列化都由一个具体的序列化器来实现，反序列化则由一个具体的反序列化器来实现。

具体的序列化器和反序列化器通过 `Serializer<T>` 和 `Deserializer<T>` 的 `Instance` 属性来获得。

基本类型和几个常用类型的序列化器、反序列化器被注册在 `Serializer` 和 `Deserializer` 这两个非泛型类的静态初始化方法中，当它们第一次被调用时会自动初始化。

而对于数组、枚举、容器和自定义类型，则会在泛型序列化器和反序列化器的 `Instance` 属性第一次被调用时初始化。

通过这种方式，实现代码不但变得更清晰易懂，而且更便于扩展。

另外还有一个附加的好处，就是当知道要序列化或反序列化的具体类型时，序列化器和反序列化器可以直接通过泛型类的 `Instance` 属性获取到，从而省去了判断查找的时间。

序列化器和反序列化器除了直接缓存在泛型类的 `Instance` 属性中以外，还在非泛型的  `Serializer` 和 `Deserializer` 类中通过 `ConcurrentDictionary` 静态字段容器做了缓存。

虽然通过 `ConcurrentDictionary` 这种缓存方式要比直接通过泛型类的 `Instance` 属性来获取序列化器和反序列化器在速度上慢几十纳秒，但是对于无法在编译期就能获取到具体类型的数据来说，这仍然是最快速的获取序列化器和反序列化器的方式。

除了对序列化器和反序列化器采用了这种特化泛型类 + `ConcurrentDictionary` 的双缓存模式以外，Hprose 在属性字段存取器、类型转换器等实现上也采用了这种方式。

这是 Hprose 2.0 for .NET 序列化和反序列化性能提高的最主要原因之一。

# 通过表达式树来存取字段和属性

在 Hprose 1.x for .NET 中，对于自定义类型的字段和属性的存取，根据不同的平台采用了直接反射和 Emit 生成代码两种方式。

在 Hprose 2.0 for .NET 中，则统一使用了表达式树生成代码的方式。表达式树生成的代码跟使用 Emit 生成的代码，在执行效率上是没有差别的。但是在实现上，表达式树实现的代码具有更好的可读性。

另外，对于表达式树生成的代码也做了双缓冲，因此序列化反序列化自定义对象的执行效率几乎可以达到甚至超过硬编码的效率。

# 通过表达式树来创建对象

在 C# 中创建一个对象，可以通过 `new` 关键字来创建，也可以通过反射的方式来创建。跟通过反射创建对象相比，`new` 一个对象显然要快的多。

但是创建泛型对象是个特例。例如：

```csharp
public T New<T>() where T : new() => new T();
```

这个方法，它在调用时，`new T()` 生成的 IL 代码实际上跟：

```csharp
 Activator.CreateInstance<T>();
```

是差不多的。

也就是说，虽然代码中写的是 `new T()`，但是实际上调用的却是 `Activator.CreateInstance<T>()`。

Hprose 中为了更快的创建泛型对象，使用了下面这个泛型对象创建工厂：

```csharp
    public static class Factory<T> {
        private static readonly Func<T> constructor = GetConstructor();
        private static Func<T> GetConstructor() {
            try {
                return Expression.Lambda<Func<T>>(Expression.New(typeof(T))).Compile();
            }
            catch {
                return () => (T)Activator.CreateInstance(typeof(T), true);
            }
        }
        public static T New() {
            return constructor();
        }
    }
```

该工厂类通过表达式树来生成创建对象的代码，表达式树生成的代码跟直接 `new` 具体类型是一样的，速度上比 `Activator.CreateInstance<T>()` 要快 2 - 3 倍（在 Mono 平台上甚至会快几十倍）。只有当表达式树创建失败时，才会使用 `Activator.CreateInstance` 作为代替方案。另外，这里使用的是 `Activator.CreateInstance(typeof(T), true)`，这样不但在性能上比 `Activator.CreateInstance<T>()` 快几纳秒，而且它还可以创建只有非 `public` 无参构造器的类的对象。

最新版本的代码可以在 github 的 [andot/hprose-dotnet](https://github.com/andot/hprose-dotnet) 分支中查看，因为 Hprose 的客户端和服务器部分尚未完成，所以没有合并入主分支。如果大家有更好的改进方式，欢迎大家提交修改。

