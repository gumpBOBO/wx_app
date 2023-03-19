// 如果多个文件需要申请则不用export
/**
 * @param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * @param myInfo 用户信息
 * @param notify 提示
 */
export interface indexStateType {
  pageTitle: string
  myInfo: myInfoType
	notify: stateNotifyType
	followee: Array<string>
	followees: Array<any>
	followers: Array<any>
	isShow: boolean
}

/**
 * @param myBgUrl 照片墙
 * @param avatar 头像
 * @param nickname 昵称
 * @param medal 牌子
 * @param concern 关注
 * @param follow 粉丝
 * @param lv 等级
 * @param loction ip属地
 */
export interface myInfoType {
  myBgUrl: string
  avatar: string
  nickname: string
  concern: number
  follow: number
  lv: string
  location: string
	objectId: string
	openid: string
}


