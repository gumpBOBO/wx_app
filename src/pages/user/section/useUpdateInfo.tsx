import { inject, reactive } from 'vue'
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'
import QQMapWX from '../libs/qqmap-wx-jssdk.min.js'

import { avatarGroup } from '../deta'
import {
  handleOpenSetting,
  notifyWarning,
  notifyDanger,
  notifyPrimary,
  notifySuccess,
	handleUpdateLv
} from '../../common/commonFun'
// ts申明
import { indexStateType, userInfoStateType } from '../types/index'

export const useUpdateInfo = (state: indexStateType, instance: any) => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  const stylePopup = {
    width: '100%',
    height: '100%'
  }
  const styleNavH = {
    height: `${customGlobalData?.topbarHeight}px`,
    'line-height': `${customGlobalData?.topbarHeight}px`,
    display: 'inline-block',
    'padding-left': '10px'
  }

  /**
   * 定义变量
   * @object userInfoState 更新用户信息变量
   */
  const userInfoState: userInfoStateType = reactive({
    avatar: 'https://gumpbobo.github.io/img/about/blog_log.png',
    nickname: '',
    location: '',
    openid: '',
    objectId: '',
    locationOpen: false
  })
	// 假设已经通过 AV.User.loginWithMiniApp() 登录
  // 用户的登录状态会保存在客户端中，可以使用 AV.User.current() 方法来获取当前登录的用户
  const user = AV.User.current()
  console.log('user--------获取当前登录的用户', user)

  /**
   * 定义方法
   * @handleSubmit 获取用户信息提交
   * @handleInput 获取昵称
   * @handleGetFuzzyLocation 根据经纬输出市区
   * @handleUserFuzzyLocation 获取模糊定位授权
   * @handleStorageMyinfo 用户信息存入本地
   * @handleLoginInfo leancloud登录
   * @handleCheckSession 校验session
	 * @handleGetFollowersAndFollowees 获取关注和粉丝
   */
  const handleSubmit = (): void => {
    if (!userInfoState.nickname || !userInfoState.location) {
      notifyDanger(state.notify)
      state.notify.msg = '请填入昵称和地区'
      return
    }
    // 根据objectId更新用户表字段
    const avUser = AV.Object.createWithoutData('_User', userInfoState.objectId)
    avUser.set('avatar', userInfoState.avatar)
    avUser.set('nickname', userInfoState.nickname)
    avUser.set('location', userInfoState.location)
    avUser.set('openid', userInfoState.openid)
    avUser.set('myBgUrl', state.myInfo.myBgUrl)
		avUser.set('isShow', false)
    // avUser.set('medal', state.myInfo.medal)
    // concern,follow 暂时不存，根据表查询条数映射
    // 用户表接口
    avUser.save().then(
      () => {
        notifySuccess(state.notify)
        state.notify.msg = '保存成功,重新登录'
        // 关闭弹框
        state.showUpdateInfoPopup = false
        // 更新页面
        // state.myInfo.avatar = userInfoState.avatar
        // state.myInfo.nickname = userInfoState.nickname
        // state.myInfo.location = userInfoState.location
        // 更新本地
        // handleStorageMyinfo()
        // 退出登录后再重新登录
        Taro.clearStorage()
        AV.User.logOut()
        handleLoginInfo()
      },
      error => {
        // 异常处理
        console.log(error)
      }
    )
  }

  const handleInput = (e: { detail: { value: string } }): void => {
    // console.log('nickname--------', e)
    userInfoState.nickname = e.detail.value
  }

  const handleGetFuzzyLocation = (): void => {
    Taro.getFuzzyLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude,
          longitude = res.longitude,
          qqmapsdk = new QQMapWX({
            key: '6GVBZ-RM3OF-HNTJ6-JF3VE-ETJLK-66FFU'
          })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: (addressRes: { result: { ad_info: { city: string } } }) => {
            console.log(addressRes.result.ad_info)
            userInfoState.location = addressRes.result.ad_info.city
          },
          fail: () => {
            // console.log('获取定位失败,请先开启手机定位！', res)
            // 输出notify
            notifyDanger(state.notify)
            state.notify.msg = '获取定位失败,请先开启手机定位'
            state.notify.duration = 0
          }
        })
      }
    })
  }

  const handleUserFuzzyLocation = (): void => {
    console.log('获取位置授权-----')
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    Taro.getSetting({
      success(res) {
        // console.log('getSetting----', res)
        if (!res.authSetting['scope.userFuzzyLocation']) {
          // 没有授权提示授权
          Taro.authorize({
            scope: 'scope.userFuzzyLocation',
            success() {
              // console.log('同意---获取定位')
              handleGetFuzzyLocation()
            },
            fail: () => {
              // console.log('不同意---', error)
              // 输出notify 并显示按钮跳转设置授权
              notifyWarning(state.notify)
              state.notify.msg = '请授权定位并重新登录小程序'
              state.notify.duration = 0
              userInfoState.locationOpen = true
            }
          })
        } else {
          // 已经授权并且弹出完善信息则调用输出地域 state.showUpdateInfoPopup &&
          handleGetFuzzyLocation()
        }
      }
    })
  }

  const handleStorageMyinfo = (): void => {
		// , medal
    const { nickname, location, avatar, myBgUrl } = state.myInfo
    // 存本地
    Taro.setStorage({
      key: 'myInfo',
			// , medal
      data: { nickname, location, avatar, myBgUrl }
    })
  }

  const handleRedirectToPost = (): void => {
    setTimeout(() => {
      if (instance.router.params.pageTitle === 'Comment' || instance.router.params.pageTitle === 'Post') {
        // 关闭所有页面跳转
        Taro.reLaunch({
          url: `/pages/post/index?id=${instance.router.params.id}&date=${instance.router.params.date}`
        })
      } else if (instance.router.params.pageTitle === 'UserInfo') {
        Taro.reLaunch({
          url: `/pages/userInfo/index?userId=${instance.router.params.userId}&userObjectId=${instance.router.params.userObjectId}`
        })
      }
    }, 1500)
  }

  const handleLoginInfo = (): void => {
    AV.User.loginWithMiniApp()
      .then(res => {
        // {
        // 	authData: {lc_weapp: {…}}
        // 	createdAt: "2023-02-12T17:01:03.682Z"
        // 	emailVerified: false
        // 	mobilePhoneVerified: false
        // 	objectId: "63e91b4fc00f1f296246448f"
        // 	updatedAt: "2023-02-15T09:11:12.028Z"
        // 	username: "sahf2gne42lqw6t50yks1mntr"
        // }
        state.showLoginPopup = false
        notifySuccess(state.notify, '登录')
        console.log('login------', res)
        const resJson = res.toJSON()
        userInfoState.openid = resJson.authData.lc_weapp.openid
        userInfoState.objectId = resJson.objectId

        if (resJson.nickname) {
          // 1. (session过期后登录&&本地删除了user)用户信息完善，表数据更新页面和本地
          // 更新页面
          state.myInfo.nickname = resJson.nickname
          state.myInfo.location = resJson.location
          state.myInfo.avatar = resJson.avatar
          state.myInfo.myBgUrl = resJson.myBgUrl
					// 是否显示
					state.isShow = resJson.isShow
          // 更新本地
          handleStorageMyinfo()
					if(state.isShow) {
						// 等级
						handleUpdateLv(state, resJson.authData.lc_weapp.openid)
						// 关注和粉丝
						handleGetFollowersAndFollowees(res)
					}
          // 跳转回文章页
          handleRedirectToPost()
        } else {
          // 2. (第一次)用户信息不完善，则提示完善用户信息调用回调，弹出完善信息，成功提交则直接更新用户信息
          state.showUpdateInfoPopup = true
          // 获取地址授权
          handleUserFuzzyLocation()
        }
      })
      .catch(console.error)
  }

  const handleCheckSession = (): void => {
    Taro.checkSession({
      success: function () {
        console.log('checkSession未过期')
        //session_key 未过期，并且在本生命周期一直有效
        // 1. 直接根据本地更新页面(在登录流程已经确保一定存入用户信息)
        Taro.getStorage({
          key: 'myInfo',
          success: function (res) {
            Object.assign(state.myInfo, res.data)
          }
        })
				state.isShow = user.attributes.isShow
				if(state.isShow) {
					// 等级
					handleUpdateLv(state, user.attributes.authData.lc_weapp.openid)
					// 关注和粉丝
					handleGetFollowersAndFollowees(user)
				}
      },
      fail: function () {
        // 2. 过期则后台重新登录
        console.log('checkSession过期重新登录')
        // 输出notify
        notifyPrimary(state.notify)
        state.notify.msg = '登录过期,重新登录中...'
        handleLoginInfo()
      }
    })
  }

	const handleGetFollowersAndFollowees = (lUser) => {
		// user: { getFollowersAndFollowees: () => Promise<{ followees: any[]; followers: any[] }> }
		lUser
			.getFollowersAndFollowees()
			.then(function (res: { followees: any[]; followers: any[] }) {
				console.log('关注粉丝----', res)
				// 关注列表 followees
				state.followees = res.followees.map(item => item.toJSON())
				// 粉丝列表 followers
				state.followers = res.followers.map(item => item.toJSON())
				state.myInfo.concern = state.followees.length
				state.myInfo.follow = state.followers.length
			})
			.catch(console.error)
	}


  // 先通过user判断是否登录
  if (!user) {
    // 1. 没有则提示登录按钮
    state.showLoginPopup = true
  } else {
    // 2. 校验session，获取关注，粉丝，等级
    handleCheckSession()
  }

  return () => (
    <>
      {/* 一键登录 */}
      <nut-popup
        style={{ padding: '30px' }}
        v-model:visible={state.showLoginPopup}
        close-on-click-overlay={false}
        round
        class="login-popup"
      >
        <view class="login-popup-content" onTap={() => handleLoginInfo()}>
          <text>登录</text>
          <text class="blog-name">廿壴博客</text>
        </view>
        <div style="transform: translateY(77%);">
          <span class="wave active">
            <span class="before"></span>
            <span class="after"></span>
          </span>
        </div>
      </nut-popup>

      {/* 完善我的信息 */}
      <nut-popup
        position="top"
        style={stylePopup}
        v-model:visible={state.showUpdateInfoPopup}
        pop-class="update-info-popup"
        round
      >
        <div style={`height: ${customGlobalData?.systemInfo.statusBarHeight}px`}></div>
        <text style={styleNavH}>完善我的信息</text>
        <view class="avatar-wrapper">
          <nut-avatar
            class="my-avatar"
            size="large"
            icon={userInfoState.avatar || avatarGroup[0].auto[0]}
            shape="round"
            onError={() => {
              userInfoState.avatar = avatarGroup[0].auto[0]
            }}
          ></nut-avatar>
          <nut-grid border={false} column-num={6} clickable={true}>
            {avatarGroup[0].auto.map((item: string, index: number) => {
              return (
                <nut-grid-item
                  key={index}
                  onClick={() => {
                    userInfoState.avatar = item
                  }}
                >
                  <nut-avatar size="small" icon={item} shape="round"></nut-avatar>
                </nut-grid-item>
              )
            })}
          </nut-grid>
        </view>

        <view class="input-box">
          <text class="input-label">自定义头像</text>
          <view class="input-box-content">
            <input
              class="weui-input"
              placeholder="请贴入您的头像外链"
              onBlur={e => {
                userInfoState.avatar = e.detail.value
              }}
            />
          </view>
        </view>
        <view class="input-box">
          <text class="input-label">昵称</text>
          <view class="input-box-content">
            <input
              type="nickname"
              class="weui-input"
              placeholder="请输入昵称"
              onInput={e => handleInput(e)}
              onBlur={e => handleInput(e)}
            />
          </view>
        </view>
        <view class="input-box">
          <text class="input-label">地区</text>
          <view class="input-box-content">
            <text class="input-addr">{userInfoState.location}</text>
            <nut-button
              size="mini"
              type="success"
              v-show={userInfoState.locationOpen}
              onClick={handleOpenSetting}
            >
              授权
            </nut-button>
          </view>
        </view>
        <nut-button
          block
          type="primary"
          class="btn-submit"
          onClick={handleSubmit}
        >
          确定
        </nut-button>
      </nut-popup>
    </>
  )
}

/* 
流程逻辑：
场景1： 第一次正常登录	2：登录后session未过期	3. 登录后session过期	4. 没本地	5. 登录失败
1. 第一次登录 --> 弹框登录 --> 登录成功 --> 用户表信息不完善弹出完善用户信息和获取定位授权 --> 信息完整提交数据库成功 --> 存本地更新页面
																																										--> 定位不授权则notify并转到设置 --> 返回刷新页面？
																			--> 用户表信息完善则不弹直接获取后更新页面
													--> 登录失败 --> notify
2. 第二次登录 --> 有本地 --> session未过期 --> 直接获取用户表信息更新页面
						 						--> session过期 --> 调用登录走流程1，直接更新页面
						 --> 没本地 --> 走流程1，根据用户信息是否完善执行不同流程							
*/
