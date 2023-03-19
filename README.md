# 小程序：taro3+Vue3+ts+leancloud+pinia+nutui3

#### 介绍
taro3+Vue3+ts+leancloud+pinia+nutui3 微信小程序

#### 软件架构
```
taro-vue3                       
├─ config                                           
│  ├─ dev.js                  开发时配置          
│  ├─ index.js                默认配置       
│  └─ prod.js                 打包时配置           
├─ src   
│  ├─ assets				  静态资源
│  ├─ components              组件文件夹  
│  │  └─ Counter.vue   
│  ├─ libs              	  库文件夹
│  ├─ pages                   页面
│  │  └─ index  
│  │     ├─ libs              分包使用的插件库文件
│  │     ├─ types             分包使用的ts申明
│  │     ├─ section             
│  │     │  └─ useBanner.tsx  页面模块(业务逻辑跟着模块走)  
│  │     ├─ data.ts           分包使用的数据常量
│  │     ├─ index.config.ts   页面配置(小程序默认)
│  │     ├─ index.styl        页面样式(小程序默认)
│  │     └─ index.vue         页面主页(小程序默认)
│  │     └─ useindex.tsx      tsx入口
│  ├─ stores                  pinia状态管理文件夹
│  │  └─ counter.ts 
│  ├─ utils                   
│  │  └─ createApp.ts		  入口配置
│  │  └─ deta.ts			  全局常量
│  │  └─ nutPlguin.ts		  nutui组件导入
│  │  └─ utils.ts			  公共工具类方法
│  ├─ app.config.ts           小程序进行全局配置
│  ├─ app.styl                小程序全局样式
│  ├─ app.ts                  入口页面js
│  └─ index.html              入口页面html
├─ types                      
│  └─ global.d.ts             ts全局申明
├─ .editorconfig              多人协作维护一致的编码风格(初始时生成，其配置可覆盖vscode本地配置)
├─ .eslintrc                  taro初始默认esline配置文件
├─ .eslintrc.js               小波增加的esline配置文件    
├─ .gitignore                 git忽略配置
├─ .npmrc                     npm镜像地址
├─ .prettierrc                prettier代码格式美化配置
├─ babel.config.js            babel配置
├─ LICENSE                    
├─ package.json               项目配置，依赖
├─ pnpm-lock.yaml             pnpm配置
├─ project.config.json        微信小程序项目配置 project.config.json
├─ project.private.config.json对应上面project.config.json的私有配置
├─ project.tt.json            字节跳动小程序项目配置 project.tt.json
├─ README.en.md                 
├─ README.md    
├─ .husky                     git自动检测
└─ tsconfig.json              TypeScript 配置
```

#### 安装教程

请直接访问小波博客 https://blog.ganxb2.com/48056.html

#### 使用说明

遵循 CC BY-NC-SA 4.0 许可协议 使用

#### 参与贡献

1.  


#### 路由

首页 --> 文章页		**navigateTo**

文章页 --> 评论页	**navigateTo**

评论页 --> 用户信息页	**navigateTo**

我的 --> 功能页面	**navigateTo**



#### TODO

- [ ] 文章详情页（~~骨架屏，底部置顶按钮组~~，js图片绑定高度）

  2023年1月30日 23:18:52

- [x] ~~app.ts把主题引用抽出~~

- [x] ~~头部的分类按钮弹层，搜索按钮弹层~~

- [x] ~~state页面双向变量优化~~

- [x] ~~pageTitle改成根据code映射~~

- [x] ~~列表的空数据和有数据判断~~

- [x] ~~主页的banner轮播swiper~~

  2023年2月2日 13:41:58

- [x] ~~用户页~~

- [x] ~~swiper图片高度，我的背景图片高度~~

- [x] ~~文章详情页底部按钮 暗黑模式没有点击反馈效果~~

- [x] ~~评论页~~

  2023年2月16日 13:32:55

- [x] ~~我的页面leancloud流程，微信授权登录~~

- [x] ~~操作提示~~

- [x] ~~退出功能~~

- [x] ~~文章leancloud流程~~

- [x] ~~评论leancloud流程~~

- [x] ~~评论等级统计~~

- [x] ~~文章页样式优化~~

- [x] ~~页面跳转~~

- [x] ~~照片墙图片~~，

- [x] ~~评论回复的comment处理~~

- [x] ~~评论后消息通知~~

- [x] ~~**评论模块校验用户登录**~~

- [x] ~~**评论模块交互，先回复再评论文章有bug**~~

- [x] ~~**第一次注册成功后，主动重新登录一次**~~

  2023年2月21日 17:09:19

- [x] ~~文章访问统计~~

- [x] ~~评论点赞~~

- [x] ~~首页分类加载~~

- [x] ~~首页上拉加载数据~~

- [x] ~~文章页评论统计~~

- [x] ~~文章页点赞统计~~

- [x] ~~生产环境去除console~~

- [x] ~~group-cell图标位置优化(左边菜单和用户中心)~~

- [x] ~~注册弹框优化~~

  2023年2月23日 01:26:30

- [x] ~~**首页分类弹出层穿透滚动bug**  参考评论页面处理~~

- [x] ~~关注，粉丝leancloud流程~~

- [x] ~~文章页评论总数传给评论页，减少一次请求~~

  2023年2月24日 10:39:05

- [x] ~~文章页内容用首页传过来，减少一次请求（暂时不好做，因为用户页会跳转文章页）~~

- [x] ~~文章收藏流程，文章页收藏统计~~

- [x] ~~主页文章列表和swiper增加status条件获取~~

- [x] ~~消息列表页面~~

- [x] ~~发现页面~~

  

- [ ] 完善用户信息页面btn增加loading效果

- [ ] 头像(onError)加载错误

- [ ] 关于页(copy用户页)

- [ ] 搜索页

- [ ] 文章分类页

- [ ] 文章归档页

- [ ] 标签页

