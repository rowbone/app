# markdown语法 #

## 标题 ##
这是一级标题
===========

# 这也是一级标题 #

这是二级标题
-----------

## 这也是二级标题 ##


我是华丽的分割线
__________________

## 注释（>） ##
> 这是markdown的基本语法（这里是块注释部分）  

>      5个空格是这种样式

## 斜体（* or _） ##

*这里是斜体*  
_或者斜体可以是这样_  

## 粗体（** or __） ##
**这里是粗体**  
__粗体也可以是这样__

## 无序列表(* or + or -) ##

* 无序列表项1
* 无序列表项2
* 无序列表项3
+ 无序列表项4
- 无序列表项5

## 有序列表(number + .) ##

1. 有序列表项1
2. 有序列表项2
3. 有序列表3

## 链接 ##

>内链方式：  

This is an [example link](http://www.baidu.com)


>引用方式：

I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3].  

[1]: http://google.com/        "Google" 
[2]: http://search.yahoo.com/  "Yahoo Search" 
[3]: http://search.msn.com/    "MSN Search"

## 图片 ##

>内联方式：

![alt text](/path/to/img.jpg "Title")

>引用方式：

![alt text][id]

[id]:/path/to/img.jpg "title"

## 代码 ##

>简单代码（类似于<code>标签）`<blockquote>`

`<button type="button" class="btn btn-primary">提交</button>`

>大块代码（类似于&lt;pre&gt;标签）tab or 4个空格 or pre

	var funcCallback1 = function() {
		// console.log('tab style code');
	}

    var funcCallback2 = function() {
        // console.log('
    }

<pre>
var funcCallback3 = function() {
	//console.log('pre style code');
}
</pre>

## 脚注 ##

hello[^hello]

[^hello]:hi

## 下划线 ##


---