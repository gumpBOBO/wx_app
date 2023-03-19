// 用来对小程序进行全局配置，配置项遵循微信小程序规范，并且对所有平台进行统一
export default {
  // 页面路径列表 	String Array
  pages: ['pages/index/index'],
  // 分包
  subpackages: [
    {
      root: 'pages/user',
      pages: ['index']
    },
    {
      root: 'pages/post',
      pages: ['index']
    },
		{
      root: 'pages/comment',
      pages: ['index']
    },
		{
      root: 'pages/userInfo',
      pages: ['index']
    },
		{
      root: 'pages/userNotice',
      pages: ['index']
    },
		{
      root: 'pages/userCollect',
      pages: ['index']
    },
		{
      root: 'pages/find',
      pages: ['index']
    },
		{
      root: 'pages/feedback',
      pages: ['index']
    },
		{
      root: 'pages/contact',
      pages: ['index']
    },
		{
      root: 'pages/business',
      pages: ['index']
    },
		{
      root: 'pages/todo',
      pages: ['index']
    },
		{
      root: 'pages/privacy',
      pages: ['index']
    },
		{
      root: 'pages/friends',
      pages: ['index']
    },
		// {
    //   root: 'pages/reward',
    //   pages: ['index']
    // },
		// {
    //   root: 'pages/myadmin',
    //   pages: ['index']
    // },
		// {
    //   root: 'pages/mybooks',
    //   pages: ['index']
    // },
  ],
  // 小程序按需引入校验
  lazyCodeLoading: 'requiredComponents',
  // 全局的默认窗口表现 Object
  window: {
    // 下拉 loading 的样式，仅支持 dark / light
    backgroundTextStyle: 'light',
    // 导航栏背景颜色
    navigationBarBackgroundColor: '#fff',
    // 导航栏标题文字内容
    navigationBarTitleText: 'WeChat',
    // 导航栏标题颜色
    navigationBarTextStyle: 'black',
    // 导航栏样式，仅支持以下值：default 默认样式；custom 自定义导航栏，只保留右上角胶囊按钮
    navigationStyle: 'custom',
    // 窗口的背景色
    backgroundColor: '#f7f8fa',
    // 顶部窗口的背景色，仅 iOS 支持
    // backgroundColorTop
    // 底部窗口的背景色，仅 iOS 支持
    // backgroundColorBottom
    // 是否开启当前页面的下拉刷新。 boolean
    enablePullDownRefresh: false,
    // 页面上拉触底事件触发时距页面底部距离，单位为 px
    onReachBottomDistance: 20
    // 屏幕旋转设置，支持 auto / portrait / landscape 详见 响应显示区域变化 String
    // pageOrientation
  },
  // 获取用户手机主题
  darkmode: true,
  // 底部 tab 栏的表现 Object
  // tabBar
  // 分包结构配置 Object Array
  // subPackages
  // 各类网络请求的超时时间，单位均为毫秒。 Taro.request,Taro.connectSocket,Taro.uploadFile,Taro.downloadFile
  // networkTimeout
  // 可以在开发者工具中开启 debug 模式，在开发者工具的控制台面板
  // debug
  // 小程序接口权限相关设置。字段类型为 Object
  permission: {
    // 'scope.userLocation': {
    //   desc: '你的位置信息将用于小程序位置接口的效果展示'
    // },
		'scope.userFuzzyLocation': {
      desc: '为符合网络安全规范要求请授权小程序获取位置信息用于小程序位置接口的效果展示'
    }
  },
	"requiredPrivateInfos" : ["getFuzzyLocation" ],
  // 申明需要后台运行的能力，类型为数组。目前支持以下项目：audio: 后台音乐播放 location: 后台定位
  // requiredBackgroundModes
  // 声明分包预下载的规则。
  // preloadRule
  // 指定小程序的默认启动路径（首页），常见情景是从微信聊天列表页下拉启动、小程序列表启动等。如果不填，将默认为 pages 列表的第一项。不支持带页面路径参数。
  // entryPagePath
  // 使用 Worker 处理多线程任务时，设置 Worker 代码放置的目录。
  // workers
  // 当小程序需要使用 Taro.navigateToMiniProgram 接口跳转到其他小程序时，需要先在配置文件中声明需要跳转的小程序 appId 列表，最多允许填写 10 个
  // navigateToMiniProgramAppIdList
}
