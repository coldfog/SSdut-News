SSdut-News
==========

大工软院的学生周知抓取小工具。
This project is a Windows Gadget. It is used to catching the students news of school of software, Dalian Technology University.

安装：
-----

右键以管理员身份运行 SSdutNews.Gadget\setup.exe 安装小工具
注意：请务必使用管理员身份运行。

=====================================================================
使用：
-----

桌面单击右键->小工具。
就会看到SSdutNews这个小工具了，双击之即可。

=====================================================================
卸载：
-----

右键以管理员身份运行 SSdutNews.Gadget\uninstall.exe 卸载小工具

=====================================================================
手动安装：
---------

当遇到未知问题无法安装时，可以手动将文件拷贝到
C:\Program Files\Windows Sidebar\Gadgets目录下

然后在同一目录下运行
SSdutNews.Gadget\dist\updateLauncher.exe --startup install

=====================================================================
手动卸载：
---------

在C:\Program Files\Windows Sidebar\Gadgets\SSdutNews.Gadget目录下
运行SSdutNews.Gadget\dist\updateLauncher.exe remove

删除C:\Program Files\Windows Sidebar\Gadgets目录下的
SSdutNews.Gadget文件夹 即可

=====================================================================
遇到其他错误 & 报BUG
--------------------

如果仍旧出现错误或者发现BUG：请将尽可能详细的具体问题的描述，和日志文件（日志文件位置在后面）的内容，发邮件到 dawn110110@foxmail.com，非常感谢！

日志文件在：
64位windows7：
C:\Windows\SysWOW64\config\systemprofile\AppData\Local\SSDUT_NEWS\ssdut.log
32位windows7：
C:\Windows\system32\config\systemprofile\AppData\Local\SSDUT_NEWS\ssdut.log
