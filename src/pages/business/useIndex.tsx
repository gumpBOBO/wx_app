import { inject, reactive } from 'vue'

// tsx-hook(保持和页面结构一致)
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { useBottomText } from '../common/useBottomText'

// 基础数据
import { theme } from '@/utils/deta'
// 页面样式(用我的页面)
import './index.styl'
import '../find/index.styl'
// ts申明
import { businessStateType, businessItemType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: businessStateType = reactive({
    pageTitle: 'Business',
  })
	const bussiness: Array<businessItemType> = [
		{
			img: 'https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
			text: '全栈开发',
			description: '借助前端工程化的标准统一特性，再配合NODEJS连接数据库实现便捷高效全栈开发'
		},
		{
			img: 'https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1534670007418-fbb7f6cf32c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80',
			text: '网页/PPT设计',
			description: '工作流程的全息透彻，为产品量身打造，美感与实用的完美组合'
		},
		{
			img: 'https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1576153192396-180ecef2a715?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
			text: '小程序/公众号开发',
			description: '一端多用，实现多平台(微信/QQ/百度/支付宝/头条)小程序一套代码'
		},
		{
			img: 'https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2500&q=80',
			text: '视频剪辑',
			description: '自媒体的时代宠儿'
		},
		{
			img: 'https://images.pexels.com/photos/15569292/pexels-photo-15569292.jpeg?auto=compress&cs=tinysrgb&w=1600',
			text: '照片后期',
			description: '藏不住的语言'
		}
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
      <view class="find-box">
        {bussiness.map((item: businessItemType, index: number) => {
          return (
            <nut-cell key={index} class="find-item-cell">
              <image
                src={item.img}
                mode="widthFix"
                defaultSource="https://blog.ganxb2.com/img/loading2.webp"
              />
              <view class="text-box">
                <text class="text">『{item.description}』</text>
                <text class="title">{item.text}</text>
              </view>
            </nut-cell>
          )
        })}
      </view>
      {bottomtextHook()}
    </view>
  )
}
