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
import { rewardStateType, rewardArrayType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: rewardStateType = reactive({
    pageTitle: 'Reward',
  })
	const rewardArray: Array<rewardArrayType> = [
		{
			img: 'https://blog.ganxb2.com/img/weixin_pay.webp',
			text1: '微信',
			text2: '打赏',
			site: 'weixin'
		},
		{
			img: 'https://blog.ganxb2.com/img/zfb_pay.webp',
			text1: '支付宝',
			text2: '打赏',
			site: 'zhifubao'
		},
	]

  /**
   * 定义方法
   *
   */
  

  /**
   * 引入子模块并给hook传值
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
			{
				rewardArray.map((item: rewardArrayType, index: number) => {
					return (
						<nut-cell key={index}>
							<view class="contact-box">
								<view class="site-img">
									<image
										src={item.img}
										mode="widthFix"
										defaultSource="https://blog.ganxb2.com/img/loading2.webp"
										showMenuByLongpress={true}
									/>
								</view>
								<view class="site-text">
									<text>{item.text1}</text>
									<text>{item.text2}</text>
								</view>
							</view>
						</nut-cell>	
					)
				})
			}
			
      {bottomtextHook()}
    </view>
  )
}
