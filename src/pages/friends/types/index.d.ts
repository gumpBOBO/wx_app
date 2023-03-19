// 如果多个文件需要申请则不用export
/**
 * @param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 */
export interface friendsStateType {
  pageTitle: string
}

interface friendsItemType {
	img: string
	title: string
	url: string
}
