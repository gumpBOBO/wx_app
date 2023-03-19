import { ref } from 'vue'
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'
import { notifyDanger, notifySuccess, notifyWarning } from '../../common/commonFun'
// ts申明
import { indexStateType } from '../types/index'

export const useChangeBg = (state: indexStateType, customGlobalData: any) => {
  // nut-popup的style属性ts申明是对象，只能定义传入
  const stylePopup = {
    width: '100%',
    height: '33%'
  }
  const styleNavH = {
    height: `${customGlobalData.topbarHeight}px`,
    'line-height': `${customGlobalData.topbarHeight}px`,
    display: 'inline-block',
    'padding-left': '10px'
  }

  const myBgUrlVal = ref<string>('')
  const isLoading = ref(false)

  const handleChangeBg = () => {
    isLoading.value = true
    if (!myBgUrlVal.value) {
      // 提示为空
      notifyWarning(state.notify)
      state.notify.msg = '请贴入正确的照片外链'
      isLoading.value = false
      return
    }

    const user = AV.User.current()
    if (!user) {
      notifyWarning(state.notify)
      state.notify.msg = '无法获取用户信息请登录'
      return
    }

    // 提交用户信息到接口
    const avUser = AV.Object.createWithoutData('_User', user.id)
    // 为属性赋值
    avUser.set('myBgUrl', myBgUrlVal.value)
    avUser.save().then(
      () => {
        notifySuccess(state.notify, '保存')
        state.myInfo.myBgUrl = myBgUrlVal.value
        isLoading.value = false
        state.showChangeBgPopup = false
        // handleStorageMyinfo() medal
        const { nickname, location, avatar, myBgUrl } = state.myInfo
        // 存本地
        Taro.setStorage({
          key: 'myInfo',
          data: { nickname, location, avatar, myBgUrl }
        })
      },
      error => {
        // 异常处理
        console.log(error)
        notifyDanger(state.notify, '保存')
      }
    )
  }

  return () => (
    <nut-popup
      position="top"
      style={stylePopup}
      v-model:visible={state.showChangeBgPopup}
      pop-class="pic-wall-popup"
      lock-scroll={true}
    >
      <div style={`height: ${customGlobalData.systemInfo.statusBarHeight}px`}></div>
      <text style={styleNavH}>更换我的照片墙</text>
      <nut-textarea
        v-model={myBgUrlVal.value}
        limit-show
        max-length="255"
        class="change-bg-textarea"
      />
      <view class="btn-change-bg-box">
        <nut-button
          // plain
          type="info"
          size="mini"
          class="btn-change-bg"
          onClick={handleChangeBg}
          loading={isLoading.value}
        >
          确定
        </nut-button>
        <text>(请帖入您的照片外链)</text>
      </view>
    </nut-popup>
  )
}
