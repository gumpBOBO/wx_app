import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// ts申明
// import { indexStateType } from '../comment/types/index'
export interface stateSmileType {
  showSmile: boolean
  allSmiles: boolean
}

// =============== 隐藏全部表情
export const handleHideSmile = (state: stateSmileType): void => {
  state.showSmile = false
  state.allSmiles = false
}

// =============== 授权(需要按钮触发)
export const handleOpenSetting = (): void => {
  console.log('查看授权')
  Taro.openSetting({
    success: function (res) {
      console.log('opensetting--------', res.authSetting)
    }
  })
}

// =============== 提示组件
export const notifySuccess = (notify: stateNotifyType, msg?: string): void => {
  notify.show = true
  notify.type = 'success'
  msg ? (notify.msg = `${msg}成功`) : notify.msg
}
export const notifyWarning = (notify: stateNotifyType, msg?: string): void => {
  notify.show = true
  notify.type = 'warning'
  msg ? (notify.msg = `警告: ${msg}`) : notify.msg
}
export const notifyDanger = (notify: stateNotifyType, msg?: string): void => {
  notify.show = true
  notify.type = 'danger'
  msg ? (notify.msg = `${msg}失败`) : notify.msg
}
export const notifyPrimary = (notify: stateNotifyType, msg?: string): void => {
  notify.show = true
  notify.type = 'primary'
  msg ? (notify.msg = `提示: ${msg}`) : notify.msg
}

// =============== 判断 session 登录
export const handleIslogin = (notify: stateNotifyType): void => {
  // 校验session，未过期不管，过期重新登录
  Taro.checkSession({
    success: function () {
      console.log('checkSession未过期')
      //session_key 未过期，并且在本生命周期一直有效 要做事吗？
    },
    fail: function () {
      // 2. 过期则后台重新登录
      console.log('checkSession过期重新登录')
      // 输出notify
      notifyPrimary(notify)
      notify.msg = '登录过期,重新登录中...'
      setTimeout(() => {
        AV.User.loginWithMiniApp()
          .then(res => {
            notifySuccess(notify, '登录')
            console.log('login------', res.toJSON())
          })
          .catch(console.error)
      }, notify.duration)
    }
  })
  // }
}

// =============== 获取当前用户评论条数
const handleLv = (commentCount: number): string => {
  let lv: string = '0️⃣'
  if (commentCount > 0 && commentCount < 10) {
    lv = '1️⃣'
  } else if (commentCount > 10 && commentCount < 50) {
    lv = '2️⃣'
  } else if (commentCount >= 50 && commentCount < 100) {
    lv = '3️⃣'
  } else if (commentCount >= 100 && commentCount < 300) {
    lv = '4️⃣'
  } else if (commentCount >= 300 && commentCount < 500) {
    lv = '5️⃣'
  } else if (commentCount >= 500 && commentCount < 700) {
    lv = '6️⃣'
  } else if (commentCount >= 700 && commentCount < 900) {
    lv = '7️⃣'
  } else if (commentCount >= 900) {
    lv = '8️⃣'
  }
  return lv
}
// 登录或者有user则获取评论等级
export const handleUpdateLv = (state: { myInfo: { lv: string } }, openid: string): void => {
  const queryCommentCount = new AV.Query('app_comment_count')
  queryCommentCount.equalTo('userId', openid)
  // 获取评论条数
  queryCommentCount.find().then((res: { toJSON: () => { (): any; new (): any; count: any } }[]) => {
    const resItemJson = res[0]?.toJSON().count || 0
    state.myInfo.lv = handleLv(resItemJson)
  })
}
