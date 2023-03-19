// ts申明
import { myInfoCategoryType } from './types/index'
/**
 * 我的
 * @array myInfoCategory 我的功能数组对象集合
 * @array cellGroupJson 其他功能数组对象集合
 */
export const myInfoCategory: Array<myInfoCategoryType> = [
  { text: '收藏', icon: 'star-n', disabled: false,  url: "/pages/userCollect/index" },
  { text: '足迹', icon: 'footprint', disabled: true,  url: "" },
	{ text: '系统消息', icon: 'notice', disabled: false, url: "/pages/userNotice/index" },
  // { text: '投稿', icon: 'edit', disabled: true,  url: "" },
]
export const cellGroupJson = [
  {
    title: '其他',
    vesion: 'v1.0.02',
    list: [
      // {
      //   title: '廿壴周边',
      //   desc: '😚看看不妨',
      //   icon: 'cart',
      //   url: ''
      // },
      {
        title: '我要反馈',
        desc: '问题多多',
        icon: 'ask2',
        url: '/pages/feedback/index'
      },
      {
        title: '联系小波',
        desc: '撩一撩',
        icon: 'message',
        url: '/pages/contact/index'
      },
      // {
      //   title: '商务合作',
      //   desc: '艺术&黄金',
      //   icon: 'scan2',
      //   url: '/pages/business/index'
      // }
    ]
  }
]

// 头像组
export const avatarGroup = [
	{ auto: [
		'https://blog.ganxb2.com/img/about/blog_log.png',
		'https://i0.hdslb.com/bfs/album/f2b3dc401e07aa7f91abb03bdfeae66d0584fd90.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/54b2a8d86741ad947fde34fd68c2132562d328a3.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/eb0090497a6061a2cecceda06dca247c60e1485c.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/cfe2f649a896e9d7e18c799ea0ddaa3bda6754d2.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/c355b559c8d1ad5f67f44b192fb2c1895a5adb04.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/1011f6bc917437cd115cc5617abef5ad65eb1997.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/d4a3cecec5b35cf3b75eaca94424999e7afa0fc3.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/b18c6c2b8ff4e9b7d880cacb4f96ec71ac3e9da3.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/7efc4731fb2da1ae4f8b383a7372e5e2f24b6259.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/da69437717eac7b1a847c4a3053947ceb1f3148b.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/dfe6b9f9e1be60d28e1d9c769dd8f589d3c05f34.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/3434891fd158fc3eda69d7a8b2e49eb18ba1401a.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/f0ff79c406039b025857ba2d7b2865c1d298caeb.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/707b57c7d6f636dd4d017a1da7f7c3445a6856c5.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/5a0df92e46f3c85431b95510c8c13ada057e24d5.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/0208693460b360c0c96e73dd43f97f31c34b4b84.jpg@160w_160h_1e_1c.webp',
		'https://i0.hdslb.com/bfs/album/2b6ca631f7cec2ba997cf62e7174aa35ab955ea1.jpg@160w_160h_1e_1c.webp'
	] }
]
