这里是 海拍客seller端angular前端指令文档（注：该项目只做展示用）。

<div class="pic-plus">
  <img width="150" src="//staticonline.hipac.cn/mallpc/other/toplogo.png">
  <span>+</span>
  <img width="160" src="http://staticonline.hipac.cn/sp/tp/content/201812/12241717325295_498x449.jpg">
</div>

---

## 特性

- 基于angular开发或组件库二次封装的指令。

- 适合海拍客供应商后台系统。


## 安装

- npm install


## 启动
- docsify serve


## 添加指令
- 在directives 下面建文件夹（比如说ngDialog）

- 在当前指令新建编写js\css（比如说ngDialog.js\ngDialog.css）

- 如果需要在当前组建立demo 文件夹 建立md 文件（比如说demo.md）

- 在菜单sidebar.md新增demo页链接

- 最后在common下index.js的控制器mainController中注入本指令


## 提交前要做
- npm run build


## 发布
- 执行npm run build

- 自测没问题合master 发布只能 master发布

- package.json 版本号加一 列 0.4.9 - 0.5.0



