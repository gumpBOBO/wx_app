// 如果多个文件需要申请则不用export
/**
 * @param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * @param showChangeBgPopup 显示修改背景的弹出层标识
 * @param showUpdateInfoPopup 显示更新用户信息
 * @param showLoginPopup 显示登录按钮
 * @param myInfo 用户信息
 * @param notify 提示
 */
export interface indexStateType {
  pageTitle: string
  showChangeBgPopup?: boolean
	showUpdateInfoPopup?: boolean
	showLoginPopup?: boolean
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
  // medal: string
  concern: number
  follow: number
  lv: string
  location: string
	openid?: string
}

export interface myInfoCategoryType {
  text: string
  icon: string
	disabled: boolean
	url: string
}

export interface userInfoStateType {
	avatar: string
	nickname: string
	location: string
	openid: string
	objectId: string
	locationOpen: boolean
}




