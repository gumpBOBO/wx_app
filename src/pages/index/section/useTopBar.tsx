// tsx-hook(保持和页面结构一致)
import { useLeftPopup } from './useLeftPopup'
import { useSearchbar } from './useSearchBar'

// ts申明
import { indexStateType } from '../types/index'

export const useTopbar = (state: indexStateType, customGlobalData: any) => {
  // 左右按钮插槽 FIXME: 尽量用定义变量方式传入插槽，直接写在jsx可能报错或者无法渲染
  const navBarslots = {
    left: () => {
      return <nut-icon class="left" name="category"></nut-icon>
    },
    // right: () => {
    //   return <nut-icon class="right" name="search"></nut-icon>
    // }
  }

  /**
   * 定义方法
   * @handletopBarLeft 点击左侧图标事件
   * @handletopBarTitle 点击页面标题事件
   * @handletopBarIcon 点击页面标题icon事件
   * @handletopBarRight 点击右侧按钮事件
   */
  const handletopBarLeft = (): void => {
    console.log('点击左侧图标事件')
    state.showLeftPopup = true
  }

  const handletopBarTitle = (): void => {
    console.log('点击页面标题事件')
  }

  const handletopBarIcon = (): void => {
    console.log('点击页面标题icon事件')
  }

  const handletopBarRight = (): void => {
    console.log('点击右侧按钮事件')
    state.showSearchPopup = true
  }

  /**
   * 引入子模块并给hook传值
   * @tsx leftPopupHook 首页左侧面板模块
   * @tsx searchbarHook 首页查询面板
   */
  const leftPopupHook: () => JSX.Element = useLeftPopup(state, customGlobalData)
  const searchbarHook: () => JSX.Element = useSearchbar(state, customGlobalData)

  return () => (
    <div class="custom-topbar-box">
      <div style={`height: ${customGlobalData.systemInfo.statusBarHeight}px`}></div>
      <nut-navbar
        style={`padding-right:${customGlobalData.topbarPaddingR + 10}px; height: ${
          customGlobalData.topbarHeight
        }px; margin-bottom: 0`}
        title="廿壴博客"
        v-slots={navBarslots}
				// title={pageTitle[state.pageTitle]}
        // safe-area-inset-top={true}
        onOnClickBack={handletopBarLeft}
        onOnClickTitle={handletopBarTitle}
        onOnClickIcon={handletopBarIcon}
        onOnClickRight={handletopBarRight}
      ></nut-navbar>
      {leftPopupHook()}
      {searchbarHook()}
    </div>
  )
}
