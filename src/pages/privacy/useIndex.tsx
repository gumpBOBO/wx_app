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
import { privacyStateType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: privacyStateType = reactive({
    pageTitle: 'Privacy',
  })

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
			<view class="privacy-box">
				<text class="h1">隐私政策</text>
				<text>『廿壴博客』非常重视用户的隐私和个人信息保护。你在使用小程序时，可能会收集和使用你的相关信息。通过《隐私政策》向你说明在你访问『廿壴博客』时，如何收集、使用、保存、共享和转让这些信息。</text>

				<text class="h2">最新更新时间</text>
				<text>协议最新更新时间为：2023-02-25</text>
				<text class="h3">一、在访问时如何收集和使用你的个人信息</text>

				<text class="h4">在访问时，收集访问信息的服务会收集不限于以下信息：</text>
				<text>1. 网络身份标识信息（小程序的 OPENID、NICKNAME）</text>
				<text>2. 设备信息（手机 MODEL、theme、地域授权）</text>
				<text>3. 浏览过程（操作方式、浏览方式与时长、性能与网络加载情况）。</text>

				<text class="h4">在访问时，『廿壴博客』内置的第三方服务会通过以下或更多途径，来获取你的以下或更多信息：</text>
				<text>1. leancloud数据库用来存取相关信息</text>

				<text class="h4">在访问时，『廿壴博客』仅会处于以下目的，使用你的个人信息：</text>
				<text>1. 用于小程序的优化与文章分类，用户优化文章</text>
				<text>2. 恶意访问识别，用于维护小程序</text>
				<text>3. 恶意攻击排查，用于维护小程序</text>
				<text>4. 小程序点击情况监测，用于优化小程序页面</text>
				<text>5. 小程序加载情况监测，用于优化小程序性能</text>
				<text>6. 用于小程序搜索结果优化</text>
				<text>7. 浏览数据的展示</text>

				<text class="h4">第三方信息获取方将您的数据用于以下用途：</text>
				<text>1. 第三方可能会用于其他目的，详情请访问对应第三方服务提供的隐私协议。</text>

				<text class="h3">二、如何使用 Cookies 和本地 LocalStorage 存储</text>
				<text>1. 『廿壴博客』为实现快速登录、深色模式切换等功能，会在你的浏览器中进行本地存储，你可以随时清除浏览器中保存的所有 Cookies 以及 LocalStorage，不影响你的正常使用。</text>

				<text>本博客中的以下业务会在你的计算机上主动存储数据：</text>
				<text>	1. 修改我的照片墙</text>


				<text class="h3">三、如何共享、转让你的个人信息</text>
				<text>1. 『廿壴博客』不会与任何公司、组织和个人共享你的隐私信息</text>
				<text>2. 『廿壴博客』不会将你的个人信息转让给任何公司、组织和个人</text>
				<text>3. 第三方服务的共享、转让情况详见对应服务的隐私协议</text>

				<text class="h3">四、附属协议</text>
				<text>1. 当监测到存在恶意访问、恶意请求、恶意攻击、恶意评论的行为时，为了防止增大受害范围，可能会临时将你的ip地址及访问信息短期内添加到黑名单，短期内禁止访问。</text>
				<text>2. 此黑名单可能被公开，并共享给其他站点（主体并非本人）使用，包括但不限于：IP地址、设备信息、地理位置。</text>
			</view>

      {bottomtextHook()}
    </view>
  )
}
