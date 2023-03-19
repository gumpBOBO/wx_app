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
import { todoStateType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: todoStateType = reactive({
    pageTitle: 'Todo'
  })
  const todo = [
		{
      title: '廿壴小程序',
      list: [
        {
          text: '完善功能页面',
					tagType: 'primary',
					tagText: '3',
        },
        {
          text: '动画交互设计',
					tagType: 'primary',
					tagText: '3',
        },
				{
          text: '小程序文档',
					tagType: 'success',
					tagText: '2',
        },
      ]
    },
    {
      title: '前端',
      list: [
        {
          text: '前端微服务',
					tagType: 'success',
					tagText: '2',
        },
        {
          text: '前端工程自动化',
					tagType: 'danger',
					tagText: '1',
        },
        {
          text: 'nodejs后端服务',
					tagType: 'danger',
					tagText: '1',
        },
        {
          text: '单元测试',
					tagType: 'success',
					tagText: '2',
        },
        {
          text: '数据可视化'
        },
        {
          text: '标准化方案'
        },
        {
          text: '开放api'
        },
        {
          text: '前端转桌面应用'
        }
      ]
    },
    {
      title: '设计',
      list: [
        {
          text: '原型设计',
					tagType: 'danger',
					tagText: '1',
        },
        {
          text: 'APP/小程序',
					tagType: 'danger',
					tagText: '1',
        },
        {
          text: '3D'
        }
      ]
    },
		{
      title: 'AI/物联',
      list: [
        {
          text: '鸿蒙',
					tagType: 'primary',
					tagText: '3',
        },
        {
          text: 'AI绘画'
        },
        {
          text: 'CHATGPT'
        }
      ]
    },
    {
      title: '后期剪辑',
      list: [
        {
          text: '影视剪辑',
					tagType: 'primary',
					tagText: '3',
        },
        {
          text: '照片后期'
        }
      ]
    },
		{
      title: '写歌',
      list: [
        {
          text: '编曲',
        },
				{
          text: '吉他',
        },
      ]
    },
		{
      title: '户外',
      list: [
        {
          text: '海南骑行',
        },
				{
          text: '耶路撒冷',
        },
      ]
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
      {todo.map((item, index) => {
        return (
          <nut-cell-group key={index} title={item.title}>
            {/* <nut-cell title={item.title} class="cell-title"></nut-cell> */}
            {item.list.map((childItem, childIndex) => {
              return (
                <nut-cell key={childIndex} title={childItem.text}>
                  {{
                    link: () => {
                      return (
                        <nut-tag mark type={childItem.tagType} v-show={childItem.tagType}>{childItem.tagText}</nut-tag>
                      )
                    }
                  }}
                </nut-cell>
              )
            })}
          </nut-cell-group>
        )
      })}
      {bottomtextHook()}
    </view>
  )
}
