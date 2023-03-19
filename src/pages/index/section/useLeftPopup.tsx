import Taro from '@tarojs/taro'
// 公共方法
import { notifyPrimary } from '../../common/commonFun'
// ts申明
import { indexStateType } from '../types/index'


export const useLeftPopup = (state: indexStateType, customGlobalData: any) => {
  const stylePopup = {
    width: '73%',
    height: '100%',
    'padding-top': `${customGlobalData.menuButtonInfo.top + 4}px`
  }

  /**
   * 定义变量
   * @array cellGroupJson 廿壴菜单链接
   */
  const cellGroupJson = [
    {
      title: '四海',
      list: [
        {
          title: '友人帐',
          desc: '星星之火',
          icon: 'people',
          url: '/pages/friends/index'
        },
        {
          title: '投喂',
          desc: '为爱发电',
          icon: 'scan',
          url: '/pages/reward/index'
        }
      ]
    },
    {
      title: '石之门',
      list: [
        {
          title: '短句',
          desc: '藏字阁',
          icon: 'link',
          url: '短句点击'
        },
        {
          title: '分类',
          desc: '新世界',
          icon: 'link',
          url: '分类点击'
        },
        {
          title: '归档',
          desc: '旧时光',
          icon: 'link',
          url: '归档点击'
        },
        {
          title: '标签',
          desc: '星辰海',
          icon: 'link',
          url: '标签点击'
        }
      ]
    },
    {
      title: '实验室',
      list: [
        {
          title: '廿壴TODO',
          desc: '未来可期',
          icon: 'link',
          url: '/pages/todo/index'
        },
        {
          title: 'MY ADMIN',
          desc: '后台管理',
          icon: 'link',
          url: '/pages/myadmin/index'
        },
        {
          title: 'MY BOOKS',
          desc: '我的故事',
          icon: 'link',
          url: '/pages/mybooks/index'
        }
      ]
    },
    {
      title: '其他',
      list: [
        {
          title: '个人信息与隐私保护',
          desc: '',
          icon: 'issue',
          url: '/pages/privacy/index'
        }
      ]
    }
  ]

  /**
   * 定义方法
   * @handleclickBlogName blog-name-box 点击事件跳转关于页面
   * @handleJumpPage 菜单跳转
   */
  const handleclickBlogName = (): void => {
    console.log('blog-name-click')
  }
	
  const handleJumpPage = (url: string): void => {
    console.log(url)
		if(url) {
			Taro.navigateTo({
				// 传过去id和创建时间，因为翻页需要根据时间来做判断
				url: `${url}`
			})
		}else {
			notifyPrimary(state.notify)
			state.notify.msg = '小波玩命开发中...'
		}
  }

  return () => (
    <nut-popup
      position="left"
      style={stylePopup}
      v-model:visible={state.showLeftPopup}
      pop-class="left-popup"
      lock-scroll={true}
    >
      <view class="blog-name-box" onTap={handleclickBlogName}>
        <nut-icon name="https://blog.ganxb2.com/img/apple-touch-icon.png" size="24"></nut-icon>
        <text class="blog-name">廿壴博客</text>
        <nut-icon name="right" size="12"></nut-icon>
      </view>

      <view class="sponsors-box">
        <div>your logo</div>
      </view>

      {cellGroupJson.map((item, index) => {
        return (
          <nut-cell-group key={index}>
            <nut-cell title={item.title} class="left-popup-cell-title"></nut-cell>
            {item.list.map((childItem, childIndex) => {
              return (
                <nut-cell
                  key={childIndex}
                  title={childItem.title}
                  desc={childItem.desc}
                  icon={childItem.icon}
                  is-link
                  onClick={() => handleJumpPage(childItem.url)}
                ></nut-cell>
              )
            })}
          </nut-cell-group>
        )
      })}
      {/* 占位符，保证底部高度可见 */}
      <view class="popup-placeholder"></view>
    </nut-popup>
  )
}
