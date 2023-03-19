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
import { contactStateType, contactArrayType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: contactStateType = reactive({
    pageTitle: 'Contact',
  })
	const contactArray: Array<contactArrayType> = [
		{
			img: 'https://blog.ganxb2.com/img/about/163.webp',
			text1: '或者网易云搜索',
			text2: '『廿壴』',
			site: '163'
		},
		{
			img: 'https://blog.ganxb2.com/img/about/weibo_gump.webp',
			text1: '或者微博搜索',
			text2: '『围脖小生』',
			site: 'weibo'
		},
		{
			img: 'https://blog.ganxb2.com/img/about/weixin_gump.webp',
			text1: '或者微信搜索',
			text2: '『ganxb2』',
			site: 'weixin'
		},
		{
			img: 'https://blog.ganxb2.com/img/about/bilibili_gump.webp',
			text1: '或者b站搜索',
			text2: '『bilibili_gump』',
			site: 'bilibili'
		},
		{
			img: 'https://img3.doubanio.com/dae/accounts/resources/20e516e/sns/assets/lg_main@2x.png',
			text1: '豆瓣搜索',
			text2: '『ganxb2』',
			site: 'douban'
		},
		{
			img: 'https://gitee.com/static/images/logo-black.svg?t=158106664',
			text1: 'gitee搜索',
			text2: '『ganxb2』',
			site: 'gitee'
		},
		{
			img: 'https://thumb10.jfcdns.com/thumb/up/2017-1/2017181126195426425744194800_600_0.jpg',
			text1: 'github搜索',
			text2: '『gumpBOBO』',
			site: 'github'
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
			{
				contactArray.map((item: contactArrayType, index: number) => {
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
