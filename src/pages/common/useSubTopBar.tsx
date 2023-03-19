import Taro from '@tarojs/taro'

// 基础数据
import { pageTitle } from '@/utils/deta'
// ts申明
interface indexStateType {
  pageTitle: string
}

// TODO: 子页面头部单独提成公共的，首页头部独立使用
export const useTopbar = (state: indexStateType, customGlobalData: any) => {
  /**
   * 定义变量&插槽
   * @slots navBarslots 左右按钮插件 TODO: 尽量用定义变量方式传入插槽，直接写在jsx可能报错或者无法渲染
   */
  const navBarslots = {
    left: () => {
      return <nut-icon class="left" name="left"></nut-icon>
    },
    right: () => {
      return <nut-icon class="right" name="more-s"></nut-icon>
    }
  }

  /**
   * 定义方法
   * @handletopBarLeft 左边按钮点击事件
   * @handletopBarTitle 点击页面标题事件
   * @handletopBarIcon 点击页面标题icon事件
   * @handletopBarRight 更多
   * @param navigateBack complete (res: TaroGeneral.CallbackResult) => void 接口调用结束的回调函数（调用成功、失败都会执行）
   * @param navigateBack fail 接口调用失败的回调函数
   * @param navigateBack success 接口调用成功的回调函数
   * @param navigateBack delta 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
   */
  const handletopBarLeft = () => {
    if (
      (state.pageTitle === 'Post' && Taro.getCurrentPages().length > 1) ||
      state.pageTitle === 'Comment' ||
      (state.pageTitle === 'UserInfo' && Taro.getCurrentPages().length > 1) ||
      state.pageTitle === 'Notice' ||
      state.pageTitle === 'Collect' ||
      state.pageTitle === 'Feedback' ||
      state.pageTitle === 'Contact' ||
      state.pageTitle === 'Business' ||
      state.pageTitle === 'Todo' ||
      state.pageTitle === 'Privacy' ||
      state.pageTitle === 'Friends' ||
      state.pageTitle === 'Reward' ||
      state.pageTitle === 'Myadmin' ||
      state.pageTitle === 'Mybooks'
    ) {
      Taro.navigateBack({
        delta: 1
      })
    } else {
      Taro.redirectTo({
        url: '/pages/index/index'
      })
    }
  }

  const handletopBarTitle = () => {
    console.log('点击页面标题事件')
  }

  const handletopBarIcon = () => {
    console.log('点击页面标题icon事件')
  }

  const handletopBarRight = () => {
    console.log('更多')
  }

  return () => (
    <div class="custom-topbar-box">
      <div style={`height: ${customGlobalData.systemInfo.statusBarHeight}px;`}></div>
      <nut-navbar
        style={`padding-right:${customGlobalData.topbarPaddingR + 10}px; height: ${
          customGlobalData.topbarHeight
        }px; margin-bottom: 0;`}
        title={pageTitle[state.pageTitle]}
        v-slots={navBarslots}
        // safe-area-inset-top={true}
        onOnClickBack={handletopBarLeft}
        onOnClickTitle={handletopBarTitle}
        onOnClickIcon={handletopBarIcon}
        onOnClickRight={handletopBarRight}
      ></nut-navbar>
    </div>
  )
}
