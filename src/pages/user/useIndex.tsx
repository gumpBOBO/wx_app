import { inject, reactive } from 'vue'
// useReachBottom
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// tsx-hook(保持和页面结构一致)
import { useNotify } from '../common/useNotify'
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { useUpdateInfo } from './section/useUpdateInfo'
import { useChangeBg } from './section/useChangeBg'
import { useUserInfo } from './section/useUserInfo'
import { useBottomText } from '../common/useBottomText'
import { useTabbar } from '../common/useTabBar'

// 基础数据
import { theme, instance } from '@/utils/deta'
import { myInfoCategory, cellGroupJson } from './deta'
// 公共方法
import { handleOpenSetting, notifyPrimary, notifySuccess } from '../common/commonFun'
// 页面样式
import './index.styl'
// ts申明
import { indexStateType, myInfoCategoryType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: indexStateType = reactive({
    pageTitle: 'My',
    showChangeBgPopup: false,
    showUpdateInfoPopup: false,
    showLoginPopup: false,
    myInfo: {
      myBgUrl: 'http://p1.music.126.net/QMciargoIQS3RrTGjFDuJA==/109951168222519134.jpg',
      avatar: 'https://blog.ganxb2.com/img/about/blog_log.png',
      nickname: '廿壴博客',
      location: '中国',
      // medal: '',
      concern: 0,
      follow: 0,
      // 通过评论统计表条数来判断修改lv
      lv: '0️⃣',
    },
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
    },
		followee: [],
		// leancloud接口返回粉丝和关注
		followees: [],
		followers: [],
		isShow: false
  })

  /**
   * 定义方法
   * @handleJumpPage 跳页面
   * @handleQuit 退出回调
   */
  const handleJumpPage = (url: string): void => {
		console.log(1111, url)
		if(url) {
			Taro.navigateTo({
				// 传过去id和创建时间，因为翻页需要根据时间来做判断
				url: `${url}`
			})
		}else {
			notifyPrimary(state.notify)
			state.notify.msg = '小波玩命开发中...'
		}
  }

  const handleQuit = (): void => {
    Taro.clearStorage()
    AV.User.logOut()
    notifySuccess(state.notify, '退出')
    // 延迟时间等于Notify的duration
    setTimeout(() => {
      // 关闭所有页面跳转首页
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }, state.notify.duration)
  }

  /**
   * 引入子模块并给hook传值
   * @notifyHook 提示组件
   * @topplaceholderHook 头部占位符高度 = topbarHook
   * @topbarHook 置顶头部导航栏
   * @updateInfoHook 完善我的信息
   * @changebgHook 更改我的背景
   * @bottomtextHook 页脚文字
   * @tabbarHook 底部置顶导航标签栏
   */
  const notifyHook: () => JSX.Element = useNotify(state.notify)
  const topplaceholderHook: () => JSX.Element = useTopPlaceholder(customGlobalData)
  const topbarHook: () => JSX.Element = useTopbar(state, customGlobalData)
  const updateInfoHook: () => JSX.Element = useUpdateInfo(state, instance)
  const changebgHook: () => JSX.Element = useChangeBg(state, customGlobalData)
	const userInfoHook: () => JSX.Element = useUserInfo(state)
  const bottomtextHook: () => JSX.Element = useBottomText()
  const tabbarHook: () => JSX.Element = useTabbar(state)


  return () => (
    <view
      class={[
        'index',
        theme.value === 'dark' ? 'nut-theme-dark' : '',
        state.showChangeBgPopup || state.showLoginPopup ? 'noScroll' : ''
      ]}
    >
      {notifyHook()}
      {topplaceholderHook()}
      {topbarHook()}

      {updateInfoHook()}
      {changebgHook()}

			{/* 我的信息 */}
      {userInfoHook()}

      {/* 我的菜单 */}
      <nut-cell class="my-info-category">
        <text class="my-info-category-title">我的</text>
        <nut-grid column-num={3} border={false} clickable={true}>
          {myInfoCategory.map((item: myInfoCategoryType, index: number) => {
            return (
              // click事件不传值就直接写方法名，要传则要完整格式 () => fun() onClick={() => handleSearch(item)}
              <nut-grid-item key={index} text={item.text} icon={item.icon} class={{ disabled: item.disabled}}  onClick={() => handleJumpPage(item.url)}></nut-grid-item>
            )
          })}
        </nut-grid>
      </nut-cell>

      {/* 其他菜单 */}
      <nut-cell-group>
        <nut-cell title={cellGroupJson[0].title} class="cell-group-title"></nut-cell>
        {cellGroupJson[0].list.map((childItem, childIndex) => {
          return (
            <nut-cell
              key={childIndex}
              title={childItem.title}
              desc={childItem.desc}
              icon={childItem.icon}
              is-link
              onClick={() => handleJumpPage(childItem.url)}
            ></nut-cell>
          )
        })}
				<nut-cell
					title="商务合作"
					desc="艺术&黄金"
					icon="scan2"
					is-link
					v-show={state.isShow}
					onClick={() => handleJumpPage('/pages/business/index')}
				></nut-cell>
        <nut-cell
          title="查看授权"
          desc="小程序"
          icon="setting"
          is-link
          onClick={handleOpenSetting}
        ></nut-cell>
        <nut-cell
          title="版本号"
          desc={cellGroupJson[0].vesion}
          class="cell-group-title cell-group-vesion"
        ></nut-cell>
        <nut-cell class="cell-group-quit" onClick={handleQuit}>
          <text>退出</text>
        </nut-cell>
      </nut-cell-group>

      {bottomtextHook()}
      {tabbarHook()}
    </view>
  )
}