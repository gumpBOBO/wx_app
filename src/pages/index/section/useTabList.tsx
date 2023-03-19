// ts申明
import { indexStateType, tabArrType } from '../types/index'

export const useTablist = (state: indexStateType) => {
  /**
   * 定义变量
   * @object tabArr
   * 	@param title 标题
   * 	@param paneKey 分类标识，文章列表接口所需参数
   * 	@param icon 图标
   * @slots tab自定义插槽
   */
  const tabArr: Array<tabArrType> = [
    {
      title: '最新',
      paneKey: 'new',
      icon: 'dongdong'
    },
    {
      title: '技术总结',
      paneKey: 'code',
      icon: 'dongdong'
    },
    {
      title: '随想',
      paneKey: 'design',
      icon: 'JD'
    },
    {
      title: '生活',
      paneKey: 'essay',
      icon: 'JD'
    },
		{
      title: '工具',
      paneKey: 'software',
      icon: 'JD'
    }
    // {
    //   title: '动漫',
    //   paneKey: 'animate',
    //   icon: 'JD'
    // },
    // {
    //   title: '电影',
    //   paneKey: 'movie',
    //   icon: 'dongdong'
    // },
    // {
    //   title: '音乐',
    //   paneKey: 'music',
    //   icon: 'JD'
    // },

  ]
  const slots = {
    titles: () => {
      return tabArr.map((item: tabArrType) => {
        return (
          <div
            onClick={() => handleClick(item)}
            class={['nut-tabs__titles-item', state.tabValue == item.paneKey ? 'active' : '']}
            key={item.paneKey}
            style="margin-left: 10px; margin-right: 10px;"
          >
            <span class="nut-tabs__titles-item__text">{item.title}</span>
            <span class="nut-tabs__titles-item__smile">
              <i class="nutui-iconfont nut-icon nut-icon-joy-smile"></i>
            </span>
          </div>
        )
      })
    },
    default: () => {
      return tabArr.map((item: tabArrType, index: number) => {
        return <nut-tabpane key={index} pane-key={item.paneKey} class="tabpane-hide"></nut-tabpane>
      })
    }
  }

  /**
   * 定义方法
   * @handleClick 更改state.tabValue的值，list渲染模块根据标识获取不同分类文章
   */
  const handleClick = (item: tabArrType): void => {
    state.tabValue = item.paneKey
    // 切换先显示骨架屏
    state.getListCode = ''
    console.log('click', state.tabValue)
  }

  return () => (
    <nut-tabs
      v-model={state.tabValue}
      title-scroll
      title-gutter="10"
      v-slots={slots}
      size="small"
      type="smile"
      class="tab-scroll-custom"
      // 一定要+name不然无法自动滚动
      name="tabValue"
    ></nut-tabs>
  )
}

