import { ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'

interface indexStateType {
  pageTitle: string
}

export const useTabbar = (state: indexStateType) => {

  // 默认选中tab(简单的ref变量可以不用申明，ts插件会自动推导)
  const activeName = ref('')

  // tab切换事件
  const handleTabSwitch = (item?: object, index?: string): void => {
    console.log('tabSwitch-----', item, index)
    if (index === 'My') {
      Taro.redirectTo({
        url: '/pages/user/index'
      })
    } else if (index === 'Home') {
      Taro.redirectTo({
        url: '/pages/index/index'
      })
		} else if (index === 'Find') {
			Taro.redirectTo({
				url: '/pages/find/index'
			})
		}
  }
  // 返回事件不刷新子组件，需要调用onshow生命周期刷新赋值
  useDidShow(() => {
    activeName.value = state.pageTitle
  })

  return () => (
    <nut-tabbar
      bottom={true}
      safe-area-inset-bottom={true}
      onTabSwitch={handleTabSwitch}
      v-model:visible={activeName.value}
      placeholder={true}
    >
      {/* <nut-tabbar-item
        tab-title="福利"
        name="Fabulous"
        icon="fabulous"
        dot={true}
      ></nut-tabbar-item> */}
      {/*  num="5" */}
      <nut-tabbar-item tab-title="发现" name="Find" icon="find"></nut-tabbar-item>
      <nut-tabbar-item tab-title="廿壴博客" name="Home" icon="home"></nut-tabbar-item>
      <nut-tabbar-item tab-title="我的" name="My" icon="my"></nut-tabbar-item>
    </nut-tabbar>
  )
}

