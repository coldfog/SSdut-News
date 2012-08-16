
## 概述

本文档是SSdut News的开发者文档，目的是为了便于二次开发及学习交流使用。

### SSdut News是什么

SSdut News 是专为大连理工软件学院学院网定制的学生周知抓取桌面小工具(Windows Gadget)。目的是为了能够方便同学查看学生周知，第一时间获取学生周知，从此脱离每天登录烦人的学院网苦恼。

SSdut News 使用JS+HTML+CSS+PYTHON开发，并且是完全开源的，遵守 [Apache License, Version 2.0][1] 许可证。 

在开发过程中使用到了如下第三方库，您可以从以下地址获得：

+ [Tornado][2]
+ [PyWin32(需翻墙)][3]
+ [Py2exe][4]


[1]: http://www.apache.org/licenses/LICENSE-2.0    "Apache License, Version 2.0"
[2]: http://www.tornadoweb.org/ "PyWin32"
[3]: http://sourceforge.net/projects/pywin32/ "Tornado"
[4]: http://www.py2exe.org/ "Py2exe"


### 关于开发者

姓名： 冯昱尧

隶属：创新中心网络组

邮箱： yyaofeng@Gmail.com


## 开发环境

### 快速开发环境搭建

+ 前端
    + 为了调试Windows Gadget程序需要安装 Dbgview小工具。并且修改注册表项 *HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Sidebar* 中的 *ShowScriptErrors* 值为1。
+ 后端
    + 安装 [Python 2.X](http://www.python.org/getit/releases/2.7.3/)
    + 安装 [Tornado](http://www.tornadoweb.org/)
    + 安装 [PyWin32](http://sourceforge.net/projects/pywin32/)
    + 安装 [Py2exe](http://sourceforge.net/projects/py2exe/files/)

## 架构说明

SSdut News
分为前端和后端两个部分。前后端之间通过HTTP协议进行通信。具体通信协议详见文件newsUpdater.py的注释部分（为了避免源代码编码问题所以用了蹩脚的英文Orz）。

+ 前端基于Windows Gadget系统，使用JS+HTML+CSS开发。功能有如下几项：
    + 绘制UI，并将后端提供的JSON格式的新闻转化为用户友好的形式显示。
    + 通过HTTP协议操作后端。包括每隔一段时间命令后端更新新闻。

+ 后端基于Python Web Server Tornado开发。使用Sqlite3作为数据库。并两次封装：
    1. 为了使后端程序一直运行，使用PyWin32将后端服务器封装入名为SSDUT News
       Updater的Windows Service。
    2. 为了使没有Python环境的用户使用，用Py2exe将程序封装为updaterLauncher.exe


## 代码结构

+ 前端
    + zh-CN/gadget.xml  Windows Gadget注册文件
    + zh-CN/flyout.html 弹出窗口的HTML文件
    + zh-CN/news.html 主窗口的HTML文件
    + zh-CN/js/news.js 前端的JS脚本
    + zh-CN/css/flyout.css 弹出窗口的CSS文件
    + zh-CN/css/news.css 主窗口的CSS文件
+ 后端
    + newsUpdater.py Tornado服务器
    + upderLauncher.py Tornado服务器的Windows Service封装模块
    + setup.py Py2exe的打包文件
+ 安装脚本
    + setup.py 安装脚本（与后端的setup.py在不同目录下）
    + unistall.py 卸载脚本

限于篇幅其余的代码细节请参照源代码注释。

## 联系方式

有任何问题请联系：

mail: yyaofeng@Gmail.com
