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
import { friendsStateType, friendsItemType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 页面双向对象集合
   */
  const state: friendsStateType = reactive({
    pageTitle: 'Friends',
  })
	const friendsArray: Array<friendsItemType> = [
		{
			img: 'https://blog.ganxb2.com/img/about/blog_log.png',
			title: '廿壴(ganxb2)',
			url: 'https://www.ganxb2.com'
		}
	]

  /**
   * 定义函数
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
				friendsArray.map((item: friendsItemType, index: number) => {
					return (
						<nut-cell
							key={index}
							class="post-info-box"
						>
							<image
								src={item.img}
								mode="heightFix"
								defaultSource="https://blog.ganxb2.com/img/loading2.webp"
							/>
							<view class="post-info">
								<text class="post-title">{item.title}</text>
								<text class="post-author">{item.url}</text>
							</view>
						</nut-cell>
					)
				})
			}

      {bottomtextHook()}
    </view>
  )
}
