import { inject, reactive } from 'vue'

// tsx-hook(保持和页面结构一致)
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { useBottomText } from '../common/useBottomText'

// 基础数据
import { theme } from '@/utils/deta'
// 页面样式(用我的页面)
import './index.styl'
// ts申明
import { noticeStateType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: noticeStateType = reactive({
    pageTitle: 'Feedback',
  })

  /**
   * 定义方法
   *
   */
  

  /**
   * 引入子模块并给hook传值
   * @notifyHook 提示组件
   * @topplaceholderHook 头部占位符高度 = topbarHook
   * @topbarHook 置顶头部导航栏
   * @bottomtextHook 页脚文字
   */
  const topplaceholderHook: () => JSX.Element = useTopPlaceholder(customGlobalData)
  const topbarHook: () => JSX.Element = useTopbar(state, customGlobalData)
  const bottomtextHook: () => JSX.Element = useBottomText()

  /**
   * 调用
   */

  return () => (
    <view class={['index', theme.value === 'dark' ? 'nut-theme-dark' : '', 'iosBottomPadding']}>
      {topplaceholderHook()}
      {topbarHook()}
			<view class="text-box">
				<text>功能完善中，</text>
				<text>有紧急问题可以返回到“联系小波”页面，获取联系方式。</text>
				<div style=" margin-top: 20px;">感谢您的体谅和反馈。</div>
			</view>
      {bottomtextHook()}
    </view>
  )
}
