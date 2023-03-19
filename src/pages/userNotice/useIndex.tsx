import { inject, reactive } from 'vue'
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// tsx-hook(保持和页面结构一致)
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { useBottomText } from '../common/useBottomText'

// 基础数据
import { theme, instance } from '@/utils/deta'
// 页面样式(用我的页面)
import './index.styl'
// ts申明
import { noticeStateType, noticeItemType } from './types/index'

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
    pageTitle: 'Notice',
    notice: [],
    getListCode: ''
  })
  const user = AV.User.current()
  const userJson = user?.toJSON()
  console.log('消息页面user----', userJson)
  console.log('消息页面路由----', instance)

  /**
   * 定义方法
   *
   */
  const handleGetNotice = (): void => {
    const query = new AV.Query('app_comment_notice')
    query.equalTo('ruserId', userJson.openid)
    query.descending('createdAt')
		query.equalTo('status', 'approved')
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
        state.notice = res.map(item => item.toJSON())
      }
      state.getListCode = '200'
      console.log('notice数据--------', state.notice)
    })
  }
  const handleRedirectToPost = (item: noticeItemType): void => {
		// 关闭所有页面跳转
		Taro.navigateTo({
			url: `/pages/post/index?id=${item.urlParams[0]}&date=${item.urlParams[1]}`
		})
  }

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
  handleGetNotice()

  return () => (
    <view class={['index', theme.value === 'dark' ? 'nut-theme-dark' : '', 'iosBottomPadding']}>
      {topplaceholderHook()}
      {topbarHook()}

      <nut-skeleton
        class={['post-skeleton']}
        width="375px"
        height="35px"
        title
        animated
        row="8"
        loading={!state.getListCode}
        round
      >
        {/* TODO: 根据接口返回的code再增加错误提示和无网络提示 */}
        {state.notice.length > 0 ? (
          state.notice.map((item: noticeItemType, index: number) => {
            return (
              <nut-cell
                key={index}
                onClick={() => handleRedirectToPost(item)}
								class="notice-item"
              >
								<view class="name-box">
									<a class="name">{item.userNick}</a>回应你说：
								</view>
								<view class="comment">{item.comment}</view>
								<text class="title">- {item.urlParams[4]}</text>
              </nut-cell>
            )
          })
        ) : (
          <>
            {/* FIXME: 组件BUG，如果用一个标签渲染切换无法视图更新 */}
            <nut-empty
              image="empty"
              description="暂无消息"
              v-show={state.getListCode === '200'}
            ></nut-empty>
            <nut-empty
              image="error"
              description="加载失败/错误"
              v-show={state.getListCode === '401'}
            ></nut-empty>
            <nut-empty
              image="network"
              description="无网络/网络超时"
              v-show={state.getListCode === '500'}
            >
              <div style="margin-top: 10px">
                <nut-button icon="refresh" type="primary">
                  刷新
                </nut-button>
              </div>
            </nut-empty>
          </>
        )}
      </nut-skeleton>

      {bottomtextHook()}
    </view>
  )
}
