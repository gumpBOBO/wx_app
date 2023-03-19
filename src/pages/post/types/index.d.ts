// 如果多个文件需要申请则不用export
/**
 * @object state
 * 	@param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * 	@param getPostCode 接口获取成功标识，用来判断骨架屏
 * 	@param post 文章信息对象
 * 	@param notify 提示组件对象
 */
export interface indexStateType {
  pageTitle: string
	getPostCode: string
	isCollect: boolean
  post: postType
	notify: stateNotifyType
}
/**
 * @object post 文章数据
 * 	@param content 文章内容
 * 	@param title 文章标题
 * 	@param id 文章id
 * 	@param like 文章点赞数
 * 	@param comment 文章评论数
 * 	@param collect 文章收藏数
 * 	@param date 文章发布时间 (转成多少天前，插件MomentJS)
 * 	@param upDate 文章更新时间 (转成多少天前，插件MomentJS)
 * 	@param img 文章banner
 * 	@param visit 文章访问数
 * 	@param author 文章作者
 * 	@param authorId 文章作者id = 用户openid
 * 	@param authorDesc 文章作者介绍
 * 	@param authorAvatar 文章作者头像
 * 	@param mp3 朗读的音频文件地址
 * 	@param wordCount 字数统计
 * 	@param timeCount 阅读时长
 * 	@param category 分类
 * 	@param tags 标签
 * 	@param recommend 推荐
 * 	@param postType 文章引用还是原创
 */
export interface postType {
  content: string
  title: string
  id: string
  like: number
  likeUser: Array<likeUserType>
  comment: number
  collect: number
	collectUser: Array<likeUserType>
  date: string
  upDate: string
  img: string
  visite: number
  author: string
  authorId: string
	authorObjectId: string
  authorDesc: string
  avatar: string
  mp3: string
  wordCount: number
  timeCount: number
  category: string
	categoryCode: string
  tags: string
  recommend: number
  editor: string
  editorMail: string
  postType: number
	createdAt: string
	objectId: string
	isShow: boolean
}

export interface likeUserType {
  userId: string
  userName: string
  userAvatar: string
}
