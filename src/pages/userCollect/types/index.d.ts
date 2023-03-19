// 如果多个文件需要申请则不用export
/**
 * @param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * @param notify 提示
 * @param notice 消息信息返回数组
 */
export interface collectStateType {
  pageTitle: string
  // notify: stateNotifyType
  collect: Array<collectItemType>
  getListCode: string
}

interface collectItemType {
  postObjectId: string
  postId: string
  title: string
  img: string
  date: string
  category: string
  categoryCode: string
  author: string
  avatar: string
  userId: string
	userObjectId: string
}
