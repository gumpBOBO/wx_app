import { ref } from 'vue'
import Taro from '@tarojs/taro'

/**
 * 路由相关信息
 * @object instance 路由相关信息(建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，而不是频繁地调用此 API)
 * @number Taro.getCurrentPages().length 堆栈数
 */
export const instance: any = Taro.getCurrentInstance()

export const theme = ref<string>('')

export const isLoading = ref<boolean>(false)

export const isClick = ref<boolean>(false)

/**
 * 页面头部title映射常量
 */
export const pageTitle = {
	Fabulous: '福利',
	Home: '廿壴博客',
	Find: '发现',
	My: '我的',
	Post: '阅读',
	Comment: '评论',
	UserInfo: '用户信息',
	Notice: '我的消息',
	Collect: '我的收藏',
	Feedback: '反馈',
	Contact: '联系小波',
	Business: '商务合作',
	Todo: 'TODO',
	Privacy: '隐私保护',
	Friends: '友人帐',
	Reward: '投喂',
	Myadmin: 'MY ADMIN',
	Mybooks: 'MY BOOKS',
}
