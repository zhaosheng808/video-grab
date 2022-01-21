# video-grab

> 视频地址解析服务

```
获取到抖音、微博、央视（cctv.cn 与 v.cctv.cn）视频地址
```

## 项目结构
```
├── app                                   # 模块
│   │
│   ├── build                             
│   ├── libs
│   ├── src                               # 源码
│       └── ...
│   ├── dist                              # 打包生成文件
│   ├── static
│   ├── app.config.js
│   ├── app.js
│   
├── ...                                   # 其他模块  
│ 
│ 
├── server.js                             # 项目启动文件
├── config.js                             # 项目配置文件
├── package.json                          
└── README.md                             # README.md

```
## 开始

1.安装依赖
```
npm install

// linux 安装 puppeteer 需要权限 node.js 8以下 安装指定版本2.1.1
npm install puppeteer@2.1.1 --unsafe-perm=true --allow-root
```
2.本地开发
```
npm run dev
```
3.发布
```
npm run build
```

## 部署

1.将打包文件放在服务器指定目录


2.使用 pm2 重启服务

```
pm2 l // 查看当前所有node任务
pm2 restart <id|name> // 重启node任务
```
## puppeteer

> Puppeteer 是 Chrome 开发团队在 2017 年发布的一个 Node.js 包，用来模拟 Chrome 浏览器的运行.
>主要通过Puppeteer运行Chromium加载网页实现分析页面dom获取video标签，实现视频地址抓取

[puppeteer文档](http://www.puppeteerjs.com/#?product=Puppeteer&version=v13.1.1&show=api-class-puppeteer)

1.Node.js 8.x版本 需要安装 puppeteerjs@2.1.1版本

2.linux 安装 puppeteer 需要权限

```
npm install puppeteer@2.1.1 --unsafe-perm=true --allow-root
```

3.异常处理说明

对于这个错误 `Failed to launch the browser process!`，常见于linux服务器中，有以下解决方案

1).error while loading shared libraries: libXss.so.1:
```
sudo yum -y install libXScrnSaver-1.2.2-6.1.el7.x86_64
```
2).由于缺少组件可能导致不能打开谷歌浏览器 直接安装chromium
```
sudo yum install -y chromium
```
https://github.com/puppeteer/puppeteer/issues/5361