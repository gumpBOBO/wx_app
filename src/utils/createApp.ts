import { createApp } from 'vue'
import Taro from '@tarojs/taro'
// import { getStorage, getOpenId } from './tools'

// 绑定申请就必须把每个值写出来吗？？？
const customGlobalData: CustomGlobalDataType = {
  menuButtonInfo: {
    bottom: 1,
    height: 1,
    left: 1,
    right: 1,
    top: 1,
    width: 1
  },
  systemInfo: {
    model: '',
    pixelRatio: 0,
    windowWidth: 0,
    windowHeight: 0,
    system: '',
    language: '',
    version: '',
    deviceOrientation: 'portrait',
    screenWidth: 0,
    screenHeight: 0,
    SDKVersion: '',
    brand: '',
    fontSizeSetting: 0,
    benchmarkLevel: 0,
    // batteryLevel: 100,
    statusBarHeight: 0,
    bluetoothEnabled: true,
    locationEnabled: true,
    wifiEnabled: true,
    cameraAuthorized: true,
    locationAuthorized: true,
    microphoneAuthorized: true,
    notificationAuthorized: true,
    safeArea: {
      top: 47,
      left: 0,
      right: 390,
      bottom: 810,
      width: 390,
      height: 763
    },
    platform: 'devtools',
    enableDebug: false,
    // devicePixelRatio: 3,
    // mode: 'default',
    theme: 'light'
  },
  topbarTop: 0,
  topbarPaddingR: 0,
  topbarBoxHeight: 0,
  topbarHeight: 0,
  user: ''
}

// leancloud
import AV from 'leancloud-storage/dist/av-weapp.js'
AV.init({
  appId: '',
  appKey: '',
  // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
  serverURLs: 'https://.lc-cn-n1-shared.com'
})

const App = createApp({
  onLaunch() {
    // 第一执行
    // console.log('onlaunch----------', Taro.getMenuButtonBoundingClientRect())

    // customGlobalData.menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
    customGlobalData.menuButtonInfo = Object.assign(
      customGlobalData.menuButtonInfo,
      Taro.getMenuButtonBoundingClientRect()
    )
    // 获取接口的数据不要自己转别名，尽量用接口返回参数名
    customGlobalData.systemInfo = Taro.getSystemInfoSync()

    // 距离顶部的距离 = 胶囊按钮的top
    customGlobalData.topbarTop = customGlobalData.menuButtonInfo.top
    // topbar盒子高度 = 顶部高度+胶囊按钮高度+胶囊按钮的上下间距
    customGlobalData.topbarBoxHeight =
      (customGlobalData.systemInfo.statusBarHeight || 0) +
        customGlobalData.menuButtonInfo.height +
        (customGlobalData.menuButtonInfo.top - (customGlobalData.systemInfo.statusBarHeight || 0)) *
          2 || 0
    // 右填充：窗口宽度 - 胶囊按钮的左间距 - 10
    customGlobalData.topbarPaddingR =
      customGlobalData.systemInfo.windowWidth - (customGlobalData.menuButtonInfo.left + 10) || 0
    // topbar的高度 = 胶囊高度 + 胶囊的上下间距
    customGlobalData.topbarHeight =
      customGlobalData.menuButtonInfo.height +
      (customGlobalData.menuButtonInfo.top - (customGlobalData.systemInfo.statusBarHeight || 0)) * 2
  },
  onShow() {
    // 第二执行
    // console.log('onshow----------')
  },
  onHide() {
    // console.log('onhide----------')
  }
  // onPullDownRefresh: function (){
  //   Taro.stopPullDownRefresh()
  // }

  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

// 全局变量
App.provide('$customGlobalData', customGlobalData)

export default App

