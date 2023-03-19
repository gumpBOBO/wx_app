import { inject, onMounted, reactive } from 'vue'
import Taro from '@tarojs/taro'

// tsx-hook(保持和页面结构一致)
import { useNotify } from '../common/useNotify'
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from './section/useTopBar'
import { useSwiper } from './section/useSwiper'
import { useTablist } from './section/useTabList'
import { useList } from './section/useList'
import { useBottomText } from '../common/useBottomText'
import { useTabbar } from '../common/useTabBar'

// 基础数据
import { theme } from '@/utils/deta'
// 页面样式
import './index.styl'
// ts申明
import { indexStateType } from './types/index'

export const useIndex = () => {
  // 系统信息 FIXME: 因为inject的ts申请是unkown,所以暂时用any处理警告 const customGlobalData = Object.assign({},inject('$customGlobalData'))
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')

  /**
   * 定义变量
   * @object state 公共双向变量
   */
  const state: indexStateType = reactive({
    pageTitle: 'Home',
    tabValue: 'new',
    getSuccess: false,
    getListCode: '',
    showLeftPopup: false,
    showSearchPopup: false,
    notify: {
      clickFun: () => {
        console.log('click')
        state.notify.show = false
      },
      closedFun: () => {
        console.log('close')
      },
      color: '',
      background: '',
      show: false,
      type: 'primary',
      msg: '',
      duration: 2000,
      class: ''
    }
  })

  /**
   * 引入子模块并给hook传值
   * @tsx topplaceholderHook 头部占位符高度 = topbarHook
   * @tsx topbarHook 置顶头部导航栏
   * @tsx swiperHook 切换banner
   * @tsx tablistHook 文章分类可滚动的选项卡
   * @tsx listHook 文章单元格卡片风格列表
   * @tsx bottomtextHook 页脚文字
   * @tsx tabbarHook 底部置顶导航标签栏
   */
  const notifyHook: () => JSX.Element = useNotify(state.notify)
  const topplaceholderHook: () => JSX.Element = useTopPlaceholder(customGlobalData)
  const topbarHook: () => JSX.Element = useTopbar(state, customGlobalData)
  const swiperHook: () => JSX.Element = useSwiper()
  const tablistHook: () => JSX.Element = useTablist(state)
  const listHook: () => JSX.Element = useList(state)
  const bottomtextHook: () => JSX.Element = useBottomText()
  const tabbarHook: () => JSX.Element = useTabbar(state)

  /**
   * 暗黑模式(取本地值或者数据库根据用户中的主题设置获取值进行切换)
   * FIXME: 系统信息改成了同步获取并配合onMounted,nextTick使用 => completed
   */
  onMounted(() => {
    Taro.nextTick(() => {
      theme.value = customGlobalData?.systemInfo.theme || ''
    })
  })

  return () => (
    <view
      class={[
        'index',
        theme.value === 'dark' ? 'nut-theme-dark' : '',
        state.showLeftPopup ? 'noScroll' : ''
      ]}
    >
      {notifyHook()}
      {topplaceholderHook()}
      {topbarHook()}
      {swiperHook()}
      {tablistHook()}
      {listHook()}
      {bottomtextHook()}
      {tabbarHook()}
    </view>
  )
}