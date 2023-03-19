// vue3写法：和2区别需要手动按需导入
import { inject, reactive } from 'vue'
// { useReachBottom }
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// tsx-hook(保持和页面结构一致)
import { useNotify } from '../common/useNotify'
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { usePrevNext } from './section/usePrevNext'
import { useBottomText } from '../common/useBottomText'
// 测试tsx中引入vue组件
// import  Counter  from '@/components/Counter.vue'

// 基础数据
import { theme, instance, isClick } from '@/utils/deta'
import { postTypeDeta } from './deta'
// 公共方法
import { notifySuccess, notifyDanger, notifyWarning, notifyPrimary } from '../common/commonFun'
// 页面样式
import './github-markdown.styl'
import './highlight.styl'
import './index.styl'
// ts申明
import { indexStateType, likeUserType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData: any = inject('$customGlobalData')
  // 暗黑模式(取本地值或者数据库根据用户中的主题设置获取值进行切换或者根据用户手机设置)
  theme.value = customGlobalData.systemInfo.theme

  /**
   * 定义变量
   * @object state 文章对象集合
   * @boolean isClick 判断重复点击标识
   */
  const state: indexStateType = reactive({
    pageTitle: 'Post',
    getPostCode: '',
		isCollect: false,
    post: {
      content: '',
      title: '',
      id: '',
      like: 0,
      likeUser: [],
      comment: 0,
      collect: 0,
			collectUser: [],
      date: '',
      upDate: '',
      img: '',
      visite: 0,
      author: '',
      authorId: '',
      authorObjectId: '',
      authorDesc: '',
      avatar: '',
      mp3: '',
      wordCount: 0,
      timeCount: 0,
      category: '',
			categoryCode: '',
      tags: '',
      recommend: 0,
      editor: '',
      editorMail: '',
      postType: 1,
      createdAt: '',
      objectId: '',
			isShow: false
    },
    notify: {
      clickFun: () => {
        console.log('click')
        state.notify.show = false
      },
      closedFun: () => {
        console.log('close')
      },
      color: '',
      background: '',
      show: false,
      type: 'primary',
      msg: '',
      duration: 2000,
      class: ''
    }
  })
  const user = AV.User.current()?.toJSON()
  console.log('页面堆栈----', Taro.getCurrentPages())

  /**
   * 定义方法
   * @handleGetComment 获取评论总数
   * @handleLike ღ( ´･ᴗ･` )比心点击事件
   * @handleJumpComment 跳转到评论页，传过去id,title,author,img
   * @handlePostInit 文章初始
   * @handleJumpUserInfo 关注跳转用户信息页面
   */
  const handleGetComment = (): void => {
		if(state.post.isShow) {
			// 根据地址的postId查询评论(渲染pId为空)
			const query = new AV.Query('app_comment')
			query.equalTo('postId', state.post.id)
			query.equalTo('status', 'approved')
			query.count().then(res => {
				// console.log('评论统计---', res)
				if (res) {
					state.post.comment = res
				}
			})
		}
  }

  const handleLike = (): void => {
    // 判断文章是否加载完成或者成功
    if (!state.post.id) {
      notifyWarning(state.notify, '等待文章加载完成')
      return
    }

    if (user) {
      // 判断当前用户是否点赞数组中
      const userIdArr = state.post.likeUser.map((item: likeUserType) => {
        return item.userId
      })
      // const userJson = user.toJSON()
      // 如果登录后点赞,则把用户信息存入数组,如果已存则提示已赞
      !userIdArr.includes(user.openid)
        ? state.post.likeUser.push({
            userAvatar: user.avatar,
            userId: user.openid,
            userName: user.nickname
          })
        : ''
    }
    // 防止过快重复点击
    isClick.value = true
    // 文章接口
    const avUser = AV.Object.createWithoutData('app_post', state.post.id)
    const _tempLike = state.post.like + 1
    avUser.set('like', _tempLike)
    avUser.set('likeUser', state.post.likeUser)
    avUser.save().then(
      () => {
        notifySuccess(state.notify, '点赞')
        isClick.value = false
        state.post.like++
      },
      error => {
        // 异常处理
        console.log(error)
        notifyDanger(state.notify, '点赞')
      }
    )
  }

  const handleJumpComment = (): void => {
    // 判断文章是否加载完成或者成功
    if (!state.post.id) {
      notifyWarning(state.notify, '等待文章加载完成')
      return
    }
    Taro.navigateTo({
      url: `/pages/comment/index?id=${state.post.id}&title=${state.post.title}&author=${state.post.author}&img=${state.post.img}&date=${state.post.createdAt}`,
      // 方法2：获取和传送评论总数
      events: {
        // 发送数据到评论页
        pushDateToComment: function () {
          // console.log(data)
        },
        // 接收评论页更新的数据
        pullDateFormComment: function (data: { commentTotal: number }) {
					// console.log('接收评论页更新后的总条数----', data)
          state.post.comment = data.commentTotal
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('pushDateToComment', { commentTotal: state.post.comment })
      }
    })
  }

  const handlePostInit = (): void => {
    const query = new AV.Query('app_post')
    query.equalTo('id', instance.router.params.id)
    query.find().then(res => {      
      state.post = res[0].toJSON()
			// console.log('post--------', state.post)
      state.getPostCode = '200'
      state.post.visite++
      // 根据objectId修改访问统计
      const avPost = AV.Object.createWithoutData('app_post', state.post.objectId)
      // 更新访问计数
      avPost.set('visite', state.post.visite)
      avPost.save().then(
        () => {},
        error => {
          // 异常处理
          console.log(error)
        }
      )
      // 获取评论统计
      handleGetComment()
			// 修改收藏按钮样式，先判断用户是否登录过
			if (user) {
				// 再判断当前用户是否在收藏数组中
				const userIdArr = state.post.collectUser.map((item: likeUserType) => item.userId)
				if(userIdArr.includes(user.openid)) {
					// 如果已存则修改收藏按钮样式
					state.isCollect = true
				}
			}
    })
  }

  const handleJumpUserInfo = (): void => {
    Taro.navigateTo({
      url: `/pages/userInfo/index?userId=${state.post.authorId}&userObjectId=${state.post.authorObjectId}`
    })
  }

	const handleIsCollect = (): boolean => {
		let isCollect = false
		// 校验是否登录
		if (user) {
			// 后台登录
			// handleIslogin(state.notify)
      // 判断当前用户是否点赞数组中
      const userIdArr = state.post.collectUser.map((item: likeUserType) => item.userId)
			if(!userIdArr.includes(user.openid)) {
				// 如果登录后未收藏,则把用户信息存入数组
				state.post.collectUser.push({
					userAvatar: user.avatar,
					userId: user.openid,
					userName: user.nickname
				})
			}
			else {
				// 如果已存则修改收藏按钮样式
				notifyPrimary(state.notify, '已收藏')
				state.isCollect = true
				isCollect = true
			}
    }
		else {
			// 删了本地或者第一次
      notifyPrimary(state.notify, '即将跳转登录')
      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/user/index?id=${instance.router.params.id}&date=${instance.router.params.date}&pageTitle=${state.pageTitle}`
        })
      }, 1200)
			isCollect = true
		}
		return isCollect
	}

	const handleUpdateCollect = (): void => {
		// leancloud只能根据objectId来更新表
		const avPost = AV.Object.createWithoutData('app_post', state.post.objectId)
		const _tempLike = state.post.collect + 1
		avPost.set('collect', _tempLike)
		avPost.set('collectUser', state.post.collectUser)
		avPost.save().then(
			() => {
				notifySuccess(state.notify, '收藏')
				isClick.value = false
				state.post.collect++
				// 修改收藏按钮样式
				state.isCollect = true
			},
			error => {
				// 异常处理
				console.log(error)
				notifyDanger(state.notify, '收藏')
			}
		)
	}

	const handleCollect = (): void => {
		// 判断文章是否加载完成或者成功
		if (!state.post.id) {
			notifyWarning(state.notify, '请等待文章加载完成')
			return
		}
		const isCollect = handleIsCollect()
		// 已经收藏或者未登录则阻止
		if(isCollect) {
			return
		}

		// 防止过快重复点击
		isClick.value = true
		// 收藏表接口 文章 objectId,id,title,img,date,author,avatar
		const appPostCollect = AV.Object.extend('app_post_collect')
		const postCollect = new appPostCollect()
		postCollect.set('postObjectId', state.post.objectId)
		postCollect.set('postId', state.post.id)
		postCollect.set('title', state.post.title)
		postCollect.set('img', state.post.img)
		postCollect.set('date', state.post.createdAt)
		postCollect.set('category', state.post.category)
		postCollect.set('categoryCode', state.post.categoryCode)
		postCollect.set('author', state.post.author)
		postCollect.set('avatar', state.post.avatar)
		postCollect.set('userId', user.openid)
		postCollect.set('userObjectId', user.objectId)
		postCollect.save().then(
			() => {
				// 文章接口：修改收藏计数和收藏人
				handleUpdateCollect()
			},
			() => {
				// 异常处理
				notifyDanger(state.notify, '接口异常')
			}
		)
	}

  /**
   * 引入子模块并给hook传值
   * @tsx topplaceholderHook 头部占位符高度 = topbarHook
   * @tsx topbarHook 置顶头部导航栏
   * @tsx bottomtextHook 页脚文字
   */
  const notifyHook: () => JSX.Element = useNotify(state.notify)
  const topplaceholderHook: () => JSX.Element = useTopPlaceholder(customGlobalData)
  const topbarHook: () => JSX.Element = useTopbar(state, customGlobalData)
  const prevNextHook: () => JSX.Element = usePrevNext(state, instance)
  const bottomtextHook: () => JSX.Element = useBottomText()

  /**
   * 交互操作&&调用
   * @handlePostInit 文章接口
   */
  handlePostInit()

  return () => (
    <view class={['index', theme.value === 'dark' ? 'nut-theme-dark' : '']}>
      {notifyHook()}
      {topplaceholderHook()}
      {topbarHook()}
      {/* <Counter></Counter> */}

      {/* 骨架屏 */}
      <nut-skeleton
        class={['post-skeleton']}
        width="375px"
        height="35px"
        title
        animated
        row="12"
        loading={!state.getPostCode}
        round
      >
        <nut-cell class="markdown-body">
          <text class="post-title">{state.post.title}</text>
          <nut-grid
            direction="horizontal"
            border={false}
            class="post-text-box"
            column-num={3}
            center={false}
          >
            {/* getCurrentDate(10) */}
            <nut-grid-item
              icon="date"
              text={state.post.createdAt.split('T')[0]}
              icon-size="16"
            ></nut-grid-item>
            <nut-grid-item
              icon="category"
              text={state.post.category}
              icon-size="16"
            ></nut-grid-item>
            <nut-grid-item
              icon="eye"
              text={state.post.visite.toString()}
              icon-size="16"
            ></nut-grid-item>
          </nut-grid>
          <view class="post-banner-box">
            <image
              src={state.post.img}
              mode="widthFix"
              defaultSource="https://blog.ganxb2.com/img/loading2.webp"
            />
            <text class="cat-copyright-tip">{postTypeDeta[state.post.postType]}</text>
          </view>
          {/* 标题，时间，访问量，点赞数，评论数 */}
          <view v-html={state.post.content} class="content" />
          {/* 责任编辑，版权申明 */}
          <view class="license-box">
            {/* <text class="editor-box">
              责任编辑：{state.post.editor} - {state.post.editorMail}
            </text> */}
            <text class="cc-box">
              版权声明: 本博客所有文章除特别声明外，均采用 CC BY-NC-SA 4.0 许可协议。转载请注明来自
              廿壴博客！
            </text>
          </view>
          <nut-button block type="success" size="small" class="more-tips-btn" v-show={state.post.isShow}>
            更多好玩有趣百度/头条搜索「廿壴博客」
          </nut-button>
        </nut-cell>
      </nut-skeleton>

      {/* 上一篇，下一篇 抽离为模块hook */}
      {prevNextHook()}

      {/* 作者 */}
      <nut-cell class="author-box" v-show={state.post.isShow}>
        <text class="author-title">作者</text>
        <view class="author-content">
          <view class="author-avatar-box">
            <nut-avatar size="large" icon={state.post.avatar} shape="round"></nut-avatar>
            <view class="author-name-desc">
              <text class="author-name">{state.post.author}</text>
              <text class="author-desc">{state.post.authorDesc}</text>
            </view>
          </view>
          <view class="follow-box" onTap={handleJumpUserInfo}>
            <nut-button plain type="info" size="small">
              关注
            </nut-button>
          </view>
        </view>
      </nut-cell>

      {bottomtextHook()}

      {/* 评论通过跳转到另外一个页面 FIXME: nut-grid 提取为公共vue组件 */}
      <view class="post-bottom-bar">
        <nut-grid
          direction="horizontal"
          border={false}
          clickable={true}
          class={{ 'post-bottom-bar-grid': true, disabled: !state.getPostCode }}
					column-num={!state.post.isShow ? 3 : 4}
        >
          <nut-grid-item
            icon="follow"
            text={state.post.like.toString()}
            icon-size="16"
            class={{ 'btn-throttle': isClick.value }}
            onClick={handleLike}
          ></nut-grid-item>
          <nut-grid-item
            icon="comment"
            text={state.post.comment.toString()}
            icon-size="16"
						v-show={state.post.isShow}
            onClick={handleJumpComment}
          ></nut-grid-item>
          <nut-grid-item
            icon="star"
            text={state.post.collect.toString()}
            icon-size="16"
            class={{isCollect: state.isCollect}}
						onClick={handleCollect}
          ></nut-grid-item>
          <nut-grid-item icon="scan" text="赏" icon-size="16" class="disabled"></nut-grid-item>
        </nut-grid>
      </view>
    </view>
  )
}