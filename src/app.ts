// 入口配置
import App from './utils/createApp'
// nutUi组件
import './utils/nutPlguin'
import { createPinia } from 'pinia'
// 全局自定义样式
import './app.styl'

App.use(createPinia())

export default App
