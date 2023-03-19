// 如果多个文件需要申请则不用export
/**
 * @param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * @param notify 提示
 * @param notice 消息信息返回数组
 */
export interface noticeStateType {
  pageTitle: string
	notice: Array<noticeItemType>
	getListCode: string
}


interface noticeItemType {
  urlParams: string[];
  updatedAt: string;
  userNick: string;
  objectId: string;
  createdAt: string;
  status: string;
  comment: string;
  userId: string;
  ruserId: string;
  robjectId: string;
}



