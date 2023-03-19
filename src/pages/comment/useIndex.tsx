import { reactive, inject, ref } from 'vue'
import Taro, { useReachBottom } from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// tsx-hook(保持和页面结构一致)
import { useNotify } from '../common/useNotify'
import { useTopPlaceholder } from '../common/useTopPlaceholder'
import { useTopbar } from '../common/useSubTopBar'
import { usePostInfo } from './section/usePostInfo'
import { useBottomText } from '../common/useBottomText'
import { useBottomBar } from './section/useBottomBar'
import { useReplyComment } from './section/useReplyComment'

// 基础数据
import { instance, theme, isClick } from '@/utils/deta'
import './index.styl'
// 当前页面小公共方法
import { handleHideSmile, notifyPrimary, notifySuccess, notifyDanger } from '../common/commonFun'
// ts申明
import { indexStateType, commentType } from './types/index'

export const useIndex = () => {
  // 获取系统相关信息
  const customGlobalData: CustomGlobalDataType | undefined = inject('$customGlobalData')
  // 暗黑模式(取本地值或者数据库根据用户中的主题设置获取值进行切换或者根据用户手机设置)
  theme.value = customGlobalData?.systemInfo.theme || ''
  console.log('评论路由----', instance)

  /**
   * 定义页面所需变量
   * @object state 评论页面对象集合
   */
  const state: indexStateType = reactive({
    pageTitle: 'Comment',
    getCommentCode: '',
    comment: [],
    // 用来计数翻页忽略条数
    commentCount: 0,
		// 评论总条数
		commentTotal: 0,
    showSmile: false,
    allSmiles: false,
    focus: false,
    textareaVal: '',
    textareaPlaceholder: '📣吧啦吧啦亿蛤~',
    // 回复对象
    replyItem: {
      avatar: '',
      createdAt: '',
      location: '',
      nick: '',
      like: 0,
      likeUser: [],
      replyCount: 0,
      comment: '',
      objectId: '',
      postId: '',
      pid: '',
      rid: '',
      ua: '',
      rnick: '',
      rquote: '',
      userId: '',
      userObjectId: ''
    },
    // 子评论 start
    showChildCommentPopup: false,
    replyComment: [],
    parentItem: {
      avatar: '',
      createdAt: '',
      location: '',
      nick: '',
      like: 0,
      likeUser: [],
      replyCount: 0,
      comment: '',
      objectId: '',
      postId: '',
      pid: '',
      rid: '',
      ua: '',
      rnick: '',
      rquote: '',
      userId: '',
      userObjectId: ''
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
  // 防止上拉重复请求
  const isMoreLoading = ref<boolean>(false)
  const user = AV.User.current()?.toJSON()
	// 文章和评论页面通信
	const pages = Taro.getCurrentPages()
	const current = pages[pages.length - 1]
	const eventChannel = current.getOpenerEventChannel()
	// 接收 A页面的 events 中的 pushDateToComment 传递的数据
	eventChannel.on('pushDateToComment', (res: { commentTotal: number }) => {
		state.commentTotal = res.commentTotal
	})
	console.log('页面堆栈----', Taro.getCurrentPages())
	
  /**
   * 定义方法
   * @handleLike ღ( ´･ᴗ･` )比心点击事件
   * @handleFocusTextarea 点击评论内容触发textarea焦点
   * @handleShowReply 显示子回复列表
   * @handleCommentInit 评论列表初始
   * @handleGetMoreComment 触底上拉更新评论
   * @handleTotal 评论总条数
   */
  const handleLike = (item: commentType): void => {
    if (user) {
      // 获取此条评论的点赞用户数组
      const userIdArr = item.likeUser.map((item: commentType) => {
        return item.userId
      })
      // 如果登录后点赞,则把用户信息存入数组,如果已存则提示已赞
      !userIdArr.includes(user.openid)
        ? item.likeUser.push({
            userAvatar: user.avatar,
            userId: user.openid,
            userName: user.nickname
          })
        : ''
    }
    // 防止过快重复点击
    isClick.value = true
    // 评论接口
    const avUser = AV.Object.createWithoutData('app_comment', item.objectId)
    const _tempLike = item.like + 1
    avUser.set('like', _tempLike)
    avUser.set('likeUser', item.likeUser)
    avUser.save().then(
      () => {
        notifySuccess(state.notify, '点赞')
        isClick.value = false
        item.like++
      },
      error => {
        // 异常处理
        console.log(error)
        notifyDanger(state.notify, '点赞')
      }
    )
  }

  const handleFocusTextarea = (item: commentType): void => {
    state.focus = true
    console.log('评论触发焦点---', state.focus)
    // 判断回复的这条评论pid是否为空，为空则赋值新的，不为空则不修改
    state.replyItem = item
    state.replyItem.pid = !item.pid ? item.objectId : item.pid
    state.replyItem.rid = item.objectId
    state.textareaPlaceholder = `@${item.nick}:`
  }

  const handleShowReply = (item: commentType): void => {
    state.showChildCommentPopup = true
    state.parentItem = item
    // 根据state.parentItem.objectId 查询子数据
    const query = new AV.Query('app_comment')
    query.equalTo('pid', state.parentItem.objectId)
		query.equalTo('status', 'approved')
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
        state.replyComment = res.map((item: { toJSON: () => any }) => {
          return item.toJSON()
        })
      }
      console.log('replyComment------', state.replyComment)
    })
  }

  const handleCommentInit = (): void => {
    // 根据地址的postId查询评论(渲染pId为空)
    const query = new AV.Query('app_comment')
    query.equalTo('postId', instance.router.params.id)
		query.equalTo('status', 'approved')
    query.limit(20)
    // 按 createdAt 升序排列
    // query.ascending("createdAt");
    // 按 createdAt 降序排列
    query.descending('createdAt')
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
        // 用来计数翻页忽略条数
        state.commentCount = res.length
        state.comment = res.map(item => item.toJSON()).filter(item => !item.pid)
      }
      state.getCommentCode = '200'
      console.log('comment----init', state.comment)
    })
  }

  const handleGetMoreComment = (): void => {
    isMoreLoading.value = true
    // 根据地址的postId查询评论(渲染pId为空)
    const query = new AV.Query('app_comment')
    query.equalTo('postId', instance.router.params.id)
		query.equalTo('status', 'approved')
    query.limit(20)
    // 按 createdAt 降序排列
    query.descending('createdAt')
    // 忽略已拿到的数据条数
    query.skip(state.commentCount)
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
        state.commentCount += res.length
        const _tempComent = res.map(item => item.toJSON()).filter(item => !item.pid)
        state.comment.push(..._tempComent)
      }
      // 防止多次请求
      setTimeout(() => {
        isMoreLoading.value = false
      }, 300)
    })
  }

  const handleJumpUserInfo = (item: commentType): void => {
    Taro.navigateTo({
      url: `/pages/userInfo/index?userId=${item.userId}&userObjectId=${item.userObjectId}`
    })
  }

  /**
   * 引入子模块并给hook传值
   * @notifyHook 提示组件
   * @topplaceholderHook 头部占位符高度 = topbarHook
   * @topbarHook 置顶头部导航栏
   * @postInfoHook 文章信息
   * @replyCommentHook 评论的子回复弹框
   * @bottomtextHook 页脚文字
   * @bottomBarHook 底部置顶回复输入框和表情
   */
  const notifyHook: () => JSX.Element = useNotify(state.notify)
  const topplaceholderHook: () => JSX.Element = useTopPlaceholder(customGlobalData)
  const topbarHook: () => JSX.Element = useTopbar(state, customGlobalData)
  const postInfoHook: () => JSX.Element = usePostInfo(state, instance)
  const replyCommentHook: () => JSX.Element = useReplyComment(state, handleLike)
  const bottomtextHook: () => JSX.Element = useBottomText()
  const bottomBarHook: () => JSX.Element = useBottomBar(
    state,
    customGlobalData,
    handleCommentInit,
    instance,
		eventChannel
  )

  /**
   * 交互操作&&调用
   * @useReachBottom 监听用户上拉动作
   */
  useReachBottom(() => {
    if (state.commentCount >= state.commentTotal) {
      notifyPrimary(state.notify, '没有啦,没有啦啦~')
      return
    }
    // 防止多次请求
    if (!isMoreLoading.value) {
      handleGetMoreComment()
    }
  })
  handleCommentInit()

  return () => (
    <view
      class={[
        'index',
        theme.value === 'dark' ? 'nut-theme-dark' : '',
        state.showChildCommentPopup ? 'noScroll' : ''
      ]}
    >
      {notifyHook()}
      {topplaceholderHook()}
      {topbarHook()}

      {/* 文章简要信息 */}
      {postInfoHook()}

      {/* 评论区 */}
      <nut-cell class="comment-cell" onClick={() => handleHideSmile(state)}>
        <view class="comment-title">
          <text>评论区{state.commentTotal > 0 ? `(${state.commentTotal})` : ''}</text>
        </view>
        {/* 骨架屏 */}
        <nut-skeleton
          class={['post-skeleton']}
          width="375px"
          height="35px"
          title
          animated
          row="12"
          loading={!state.getCommentCode}
          round
        >
          {['200'].includes(state.getCommentCode) &&
            (state.comment.length > 0 ? (
              state.comment.map((item: commentType, index: number) => {
                return (
                  <div key={index} class="comment-box">
                    <view class="comment-avatar-box">
                      <nut-avatar
                        size="normal"
                        icon={item.avatar}
                        shape="round"
                        onClick={() => handleJumpUserInfo(item)}
                      ></nut-avatar>
                      <view class="comment-avatar-info">
                        <view class="nick-follow">
                          <view onTap={() => handleJumpUserInfo(item)}>{item.nick}</view>
                        </view>
                        <text class="date-address">
                          <text class="date-text">{item.createdAt.split('T')[0]}</text>
                          {item.location}&nbsp;{item.ua}
                        </text>
                      </view>
                    </view>
                    <view class="comment-content">
                      <view class="comment-text" onTap={() => handleFocusTextarea(item)}>
                        {item.comment}
                      </view>
                      <view class="comment-reply-like">
                        <view v-show={!item.replyCount}></view>
                        <view
                          class="reply-box"
                          onTap={() => handleShowReply(item)}
                          v-show={item.replyCount > 0}
                        >
                          {item.replyCount}条回复<nut-icon name="rect-right" size="14"></nut-icon>
                        </view>
                        <view class="like-box" onTap={() => handleLike(item)}>
                          <nut-icon name="follow"></nut-icon>
                          {item.like || ''}
                        </view>
                      </view>
                      <view class="comment-border"></view>
                    </view>
                  </div>
                )
              })
            ) : (
              // TODO: 把空状体提取为公共组件
              <nut-empty image="empty" description="空空如野，抢个沙发坐坐..."></nut-empty>
            ))}
        </nut-skeleton>
      </nut-cell>
      <view class="more-loading">
        <nut-icon
          name="loading"
          class="nut-icon-am-rotate nut-icon-am-infinite"
          v-show={isMoreLoading.value}
        ></nut-icon>
      </view>

      {/* 子评论 */}
      {replyCommentHook()}

      {bottomtextHook()}

      {/* 底部置顶回复输入框和表情 */}
      {bottomBarHook()}
    </view>
  )
}
