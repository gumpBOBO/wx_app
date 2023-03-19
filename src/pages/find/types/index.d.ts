// 如果多个文件需要申请则不用export
/**
 * @param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * @param notify 提示
 * @param notice 消息信息返回数组
 */
export interface collectStateType {
  pageTitle: string
  // notify: stateNotifyType
  find: Array<findItemType>
  getListCode: string
}

interface findItemType {
	img: string
	text: string
	title: string
	like: number
}
