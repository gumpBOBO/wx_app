import { inject, reactive } from 'vue'
import AV from 'leancloud-storage/dist/av-weapp.js'

// tsx-hook(保持和页面结构一致)
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { useBottomText } from '../common/useBottomText'
import { useTabbar } from '../common/useTabBar'

// 基础数据
import { theme, instance } from '@/utils/deta'
// 页面样式(用我的页面)
import './index.styl'
// ts申明
import { collectStateType, findItemType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 页面双向对象集合
   */
  const state: collectStateType = reactive({
    pageTitle: 'Find',
    find: [],
    getListCode: ''
  })
  console.log('发现页面路由----', instance)

  /**
   * 定义方法
   *
   */
  const handleGetFind = (): void => {
    const query = new AV.Query('find')
		query.equalTo('status', 'approved')
    query.descending('createdAt')
		query.limit(5)
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
        state.find = res.map(item => item.toJSON())
      }
      state.getListCode = '200'
      console.log('find数据--------', state.find)
    })
  }

  /**
   * 引入子模块并给hook传值
   * @ notifyHook 提示组件
   * @topplaceholderHook 头部占位符高度 = topbarHook
   * @topbarHook 置顶头部导航栏
   * @bottomtextHook 页脚文字
   */
  const topplaceholderHook: () => JSX.Element = useTopPlaceholder(customGlobalData)
  const topbarHook: () => JSX.Element = useTopbar(state, customGlobalData)
  const bottomtextHook: () => JSX.Element = useBottomText()
  const tabbarHook: () => JSX.Element = useTabbar(state)

  /**
   * 调用
   */
  handleGetFind()

  return () => (
    <view class={['index', theme.value === 'dark' ? 'nut-theme-dark' : '']}>
      {topplaceholderHook()}
      {topbarHook()}

      <nut-skeleton
        class={['list-item-skeleton']}
        width="375px"
        height="35px"
        title
        animated
        row="8"
        loading={!state.getListCode}
        round
      >
        <view class="find-box">
          {state.find.length > 0 ? (
            state.find.map((item: findItemType, index: number) => {
              return (
                <nut-cell key={index} class="find-item-cell">
                  <image
                    src={item.img}
                    mode="widthFix"
                    defaultSource="https://blog.ganxb2.com/img/loading2.webp"
										showMenuByLongpress={true}
                  />
                  <view class="text-box">
                    <text class="text">『{item.text}』</text>
                    <text class="title"> - {item.title}</text>
                  </view>
                </nut-cell>
              )
            })
          ) : (
            <>
              {/* FIXME: 组件BUG，如果用一个标签渲染切换无法视图更新 */}
              <nut-empty
                image="empty"
                description="收藏空空如野"
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
        </view>
      </nut-skeleton>

      {bottomtextHook()}
      {tabbarHook()}
    </view>
  )
}
