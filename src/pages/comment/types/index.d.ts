/**
 * @object state 评论数据对象集合
 * 	@param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * 	@param getCommentCode 接口获取成功标识，用来判断骨架屏
 * 	@param comment 评论信息数组
 * 	@param textareaVal 输入框值
 * 	@param showSmile 显示表情按钮
 * 	@param allSmiles 显示所有表情
 * 	@param commentParentId 父评论id
 * 	@param focus textarea触发焦点
 * 	@param showTopPopup 显示从上弹出的子评论
 * 	@param replyComment 回复子评论
 * 	@param parentItem 父评论对象
 */
export interface indexStateType {
  pageTitle: string
	getCommentCode: string
  comment: Array<commentType>
	commentCount: number
	textareaVal: string
	showSmile: boolean
	allSmiles: boolean
	textareaPlaceholder: string
	focus: boolean
	replyItem: commentType
	showChildCommentPopup: boolean
	replyComment: Array<commentType>
	parentItem: commentType
	notify: stateNotifyType
	commentTotal: number
}

export interface commentType {
  avatar: string
  createdAt: string
  nick: string
	location: string
	like: number
	likeUser: Array<any>
	comment: string
	replyCount: number
	objectId: string
	postId: string
	pid: string
	rid: string
	ua: string
	rnick: string
	rquote: string
	userId: string
	userObjectId: string
}
