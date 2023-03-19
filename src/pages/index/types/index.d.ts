/**
 * @object state 公共双向变量
 * @param pageTitle 改成对应页面的name，然后topBar模块中根据name映射
 * @param tabValue 分类tab切换值 = 下拉刷新值此标识识别获取不同分类数据
 * @param getSuccess 判断swiper请求成功后隐藏占位图
 * @param showLeftPopup 显示隐藏左弹出层
 * @param showSearchPopup 显示隐藏上查询弹出层
 */
export interface indexStateType {
  pageTitle: string
  tabValue: string
  getSuccess: boolean
	getListCode: string
  showLeftPopup: boolean
  showSearchPopup: boolean
	notify: stateNotifyType
}

export interface tabArrType {
  title: string
  paneKey: string
  icon: string
}

/**
 * @object listObj 文章数据对象
 * @param list 文章数组
 * @param total 文章总数，判断提示“上拉显示更多”
 */
export interface listObjType {
  list: Array<listType>
  total: number
	listCount: number
}
/**
 * @array list 文章详细数据
 * @param img 文章头图
 * @param title 文章标题
 * @param like 点赞数
 * @param avatar 头像
 * @param author 作者
 * @param visite 访问数
 * @param category 分类
 * @param id 文章id
 */
export interface listType {
  img: string
  title: string
  description: string
  like: number
  avatar: string
  author: string
  visite: number
  category: string
  id: string
	createdAt: string
}

// type 申明类型
export type handleSearchType = (quickSearchValue: string) => void
// declare 申明变量(相当于直接把申明和变量结合了，逻辑文件中直接使用不需要再像type还要调用)
// export declare handleSearchType: (quickSearchValue: string) => void

export interface stateSwiperType {
  page: number
  list: Array<swiperListType>
  getSuccess: boolean
  title: string
}

export interface swiperListType {
  img: string
  title: string
	id: string
	createdAt: string
}
