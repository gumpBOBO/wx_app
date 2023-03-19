import { inject, reactive } from 'vue'
// useReachBottom
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// tsx-hook(保持和页面结构一致)
import { useNotify } from '../common/useNotify'
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { useUserInfo } from '../user/section/useUserInfo'
import { useBottomText } from '../common/useBottomText'

// 基础数据
import { theme, instance } from '@/utils/deta'
// 当前页面小公共方法
import { notifyPrimary, notifySuccess, notifyDanger, handleIslogin, handleUpdateLv } from '../common/commonFun'
// 页面样式(用我的页面)
import '../user/index.styl'
// ts申明
import { indexStateType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData = inject<CustomGlobalDataType>('$customGlobalData')
  // 暗黑模式
  theme.value = customGlobalData?.systemInfo.theme || ''
	console.log('页面堆栈----', Taro.getCurrentPages())

  /**
   * 定义变量
   * @object state 我的页面双向对象集合
   */
  const state: indexStateType = reactive({
    pageTitle: 'UserInfo',
    myInfo: {
      myBgUrl: 'http://p1.music.126.net/QMciargoIQS3RrTGjFDuJA==/109951168222519134.jpg',
      avatar: 'https://blog.ganxb2.com/img/about/blog_log.png',
      nickname: '廿壴博客',
      location: '中国',
      concern: 0,
      follow: 0,
      // 通过评论统计表条数来判断修改lv
      lv: '0️⃣',
      // 关注接口使用
      objectId: '',
      // 判断是否关注，为按钮增加交互效果
      openid: ''
    },
    notify: {
      clickFun: () => {
        console.log('click')
        state.notify.show = false
      },
      closedFun: () => {
        console.log('close')
      },
      color: '',
      background: '',
      show: false,
      type: 'primary',
      msg: '',
      duration: 2000,
      class: ''
    },
		// 操作关注时存入关注人的 openid 到当前用户表中
    followee: [],
		// leancloud接口返回粉丝和关注
		followees: [],
		followers: [],
		isShow: false
  })
  const user = AV.User.current()
	const userJson = user?.toJSON()
	
  console.log('user----', user)
  const storageLkey: string = 'AV/???/currentUser'

  /**
   * 定义方法
   * @handleSetFollowee 当前用户表中存入关注人，用来判断按钮样式
   * @handleFollow 关注按钮触发回调，建立关注粉丝表
   * @handleGetStorageUser 初始获取本地用户信息中的 followee 改变关注按钮样式
	 * @handleGetFollowees 获取关注
	 * @handleGetFollowers 获取粉丝
	 * @handleGetUserInfo 获取用户信息
   */

  const handleSetFollowee = (): void => {
    // 用户表没有字段则直接等于[followee.openid],有就push
    const followee = userJson.followee ? userJson.followee.push(state.myInfo.openid) : [state.myInfo.openid]
    const avUser = AV.Object.createWithoutData('_User', userJson.objectId)
    // 存入关注的人 openid
    avUser.set('followee', followee)
    avUser.save().then(
      () => {
        console.log('用户表存入关注人成功')
        // 更新本地
        Taro.getStorage({
          key: storageLkey,
          success: function (res) {
            const _tempUser = Object.assign(JSON.parse(res.data), { followee: followee })
            // 存本地
            Taro.setStorage({
              key: storageLkey,
              data: JSON.stringify(_tempUser)
            })
            // 更新按钮样式为禁用
            state.followee = followee
          }
        })
      },
      error => {
        // 异常处理
        console.log(error)
        notifyDanger(state.notify, '保存')
      }
    )
  }

	const handleFollow = (): void => {
		// 校验是否登录
		if (!user) {
			// 删了本地或者第一次
			notifyPrimary(state.notify, '即将跳转登录')
			setTimeout(() => {
				Taro.redirectTo({
					url: `/pages/user/index?userId=${instance.router.params.userId}&userObjectId=${instance.router.params.userObjectId}&pageTitle=${state.pageTitle}`
				})
			}, 1200)
			return
		} else {
			handleIslogin(state.notify)
		}

		// 如果已经关注按钮禁用则无法进此流程触发
		AV.User.current()
			.follow({
				user: state.myInfo.objectId,
				attributes: {
					group: ['comment'],
					// 粉丝
					followerAvatar: userJson.avatar,
					followerNick: userJson.nickname,
					followerOpenid: userJson.openid,
					// 关注人
					followeeAvatar: state.myInfo.avatar,
					followeeNick: state.myInfo.nickname,
					followeeOpenid: state.myInfo.openid,
				}
			})
			.then(
				function () {
					notifySuccess(state.notify, '关注')
					//关注成功后把关注人openid存入用户表
					handleSetFollowee()
				},
				function (err) {
					//关注失败
					if (err) {
						notifyDanger(state.notify, '关注自己')
						// {"code":1,"error":"You can't follow yourself."}
					}
				}
			)
	}

  const handleGetStorageUser = (): void => {
    // 判断是否登录
    if (!user) {
      return
    }
    // 初始时拿到 followee 为按钮改交互样式
    Taro.getStorage({
      key: storageLkey,
      success: res => {
        state.followee = JSON.parse(res.data)?.followee || []
      },
      fail: error => {
        console.log('getstorage------', error)
      }
    })
  }

	const handleGetFollowees = (openid: string): void => {
		const query = new AV.Query('_Followee')
    query.equalTo('followerOpenid', openid)
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
				state.myInfo.concern = res.length
				state.followees = res.map((item) => item.toJSON())
			}
      console.log('handleGetFollowees--------', res, state.followees)
    })
	}
	
	const handleGetFollowers = (openid: string): void => {
		const query = new AV.Query('_Follower')
    query.equalTo('followeeOpenid', openid)
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
				state.myInfo.follow = res.length
				state.followers = res.map((item) => item.toJSON())
			}
      console.log('handleGetFollowers----------', res, state.followers)
    })
	}

	const handleGetUserInfo = (): void => {
    const query = new AV.Query('_user')
    query.get(instance.router.params.userObjectId).then(res => {
      const { myBgUrl, avatar, nickname, location, objectId, openid, isShow } = res.toJSON()
      state.myInfo = Object.assign(state.myInfo, {
        myBgUrl,
        avatar,
        nickname,
        location,
        objectId,
        openid
      })
			state.isShow = isShow
			// 等级获取
			handleUpdateLv(state, openid)
			// 关注和粉丝
			handleGetFollowees(openid)
			handleGetFollowers(openid)
    }).catch((error) => {
			console.log('error----', error)
			notifyDanger(state.notify, '查找用户')
		})
  }

  /**
   * 引入子模块并给hook传值
   * @notifyHook 提示组件
   * @topplaceholderHook 头部占位符高度 = topbarHook
   * @topbarHook 置顶头部导航栏
   * @bottomtextHook 页脚文字
   */
  const notifyHook: () => JSX.Element = useNotify(state.notify)
  const topplaceholderHook: () => JSX.Element = useTopPlaceholder(customGlobalData)
  const topbarHook: () => JSX.Element = useTopbar(state, customGlobalData)
	const userInfoHook: () => JSX.Element = useUserInfo(state, handleFollow)
  const bottomtextHook: () => JSX.Element = useBottomText()

  /**
   * 调用
   */
  handleGetUserInfo()
  handleGetStorageUser()

  return () => (
    <view class={['index', theme.value === 'dark' ? 'nut-theme-dark' : '']}>
      {notifyHook()}
      {topplaceholderHook()}
      {topbarHook()}
      {/* 用户信息 */}
			{userInfoHook()}
			<div style="min-height: 100px;"></div>
      {bottomtextHook()}
    </view>
  )
}
