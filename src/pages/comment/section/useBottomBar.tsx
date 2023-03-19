import { ref } from 'vue'
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// 基础数据
import { isLoading, isClick } from '@/utils/deta'
import { Emoji } from '../deta'
// notifyWarning
import { notifyDanger, notifyPrimary, notifySuccess, handleIslogin } from '../../common/commonFun'
// ts申明
import { indexStateType, commentType } from '../types/index'

export const useBottomBar = (
  state: indexStateType,
  customGlobalData: CustomGlobalDataType | undefined,
  handleCommentInit: () => void,
  instance: any,
	eventChannel: { emit: (arg0: string, arg1: { commentTotal: number }) => void }
) => {
  /**
   * 定义变量
   * @keyboardHeight 键盘高度
   * @smilesHeight 所有表情盒子高度
   * @user leancloud用户
   * @parentItem 用来还原parentItem
   * @replyItem 用来还原replyItem
   */
  const keyboardHeight = ref<number>(0)
  // 持续监控键盘高度
  Taro.onKeyboardHeightChange(res => {
    keyboardHeight.value = res.height - 1
  })
  // FIXME: 取消监听键盘高度变化事件。（切了页面要取消）
  // Taro.offKeyboardHeightChange(callback)
  let smilesHeight = 0
  const user = AV.User.current()?.toJSON()
  console.log('user', user)
  const parentItem: commentType = {
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
  }
  const replyItem: commentType = {
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
  }

  /**
   * 定义方法
   * @handleCommentCount 更新用户评论统计
   * @handleReplyNotice 保存评论回复通知
   * @handleUpdateReplyCount 更新回复条数并刷新评论
   * @handleAvSaveComment 回复按钮触发保存评论
   * @handleFocus 监控textarea焦点事件，显示表情按钮
   * @handleBlur 监控textarea失去焦点事件，隐藏表情按钮，隐藏所有表情盒子
   * @handleClickSmile 点击表情
   */
  const handleCommentCount = async (): Promise<void> => {
    try {
      const query = new AV.Query('app_comment_count')
      query.equalTo('userId', user.openid)
      const queryRes = await query.find()
      console.log('用户评论统计----', queryRes)
      // 判断表里是不是有了用户openid
      if (queryRes.length > 0) {
        const resItemJson = queryRes[0].toJSON()
        // 如果有则更新
        const appCommentCount = AV.Object.createWithoutData('app_comment_count', resItemJson.objectId)
        appCommentCount.set('count', resItemJson.count + 1)
        appCommentCount.save().then(
          res => {
            console.log('更新用户评论统计成功---', res)
          },
          error => {
            // 异常处理
            console.log(error)
          }
        )
      } else {
        // 没有则新建
        const appCommentCount = AV.Object.extend('app_comment_count')
        const commentCount = new appCommentCount()
        commentCount.set('count', 1)
        commentCount.set('userId', user.openid)
        commentCount.set('userObjectId', user.objectId)
        commentCount.save().then(
          res => {
            console.log('新增用户评论统计成功----', res)
          },
          () => {
            // 异常处理
            notifyDanger(state.notify, '接口异常')
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleReplyNotice = async (): Promise<void> => {
    try {
      // approved: 审核通过
      // waiting: 等待审核
      // spam: 垃圾评论
      // unsticky: 取消置顶
      // 用户的 objectId,openid,status(已读标识),回复内容,回复的人,跳转文章地址参数
      const appCommentNotice = AV.Object.extend('app_comment_notice')
      // 构建对象
      const commentNotice = new appCommentNotice()
      // 为属性赋值
      commentNotice.set('status', 'approved')
      // commentNotice.set('userObjectId', user.objectId)
      commentNotice.set('userId', user.openid)
      commentNotice.set('userNick', user.nickname)
      commentNotice.set('comment', state.textareaVal)
      // 根据 openId 查询自己被回复的消息
      commentNotice.set('ruserId', state.replyItem.userId)
      // 根据 objectId 更新 status 字段的状态
      commentNotice.set('robjectId', state.replyItem.userObjectId)
      commentNotice.set('urlParams', [
        instance.router.params.id,
        instance.router.params.date,
        instance.router.params.author,
        instance.router.params.img,
        instance.router.params.title
      ])
      return await commentNotice.save()
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateReplyCount = async (): Promise<void> => {
    try {
      let objectId = '',
        replyCount = 0
      // 根据是否打开了子评论来判断更新的父item回复统计
      if (state.showChildCommentPopup && state.textareaPlaceholder !== '📣吧啦吧啦亿蛤~') {
        objectId = state.parentItem.objectId
        replyCount = state.parentItem.replyCount
      } else {
        objectId = state.replyItem.objectId
        replyCount = state.replyItem.replyCount
      }
      const avComment = AV.Object.createWithoutData('app_comment', objectId)
      avComment.set('replyCount', replyCount + 1)
      const resComment = await avComment.save()
      return resComment
    } catch (error) {
      console.error(error)
    }
  }

  const handleAvSaveComment = (): void => {
    console.log('回复按钮触发----')
    isClick.value = true
    isLoading.value = true

    // 声明 class
    const appComment = AV.Object.extend('app_comment')
    // 构建对象
    const comment = new appComment()
    // 为属性赋值
    comment.set('pid', state.replyItem.pid)
    comment.set('rid', state.replyItem.rid)
    comment.set(
      'rnick',
      state.showChildCommentPopup && state.textareaPlaceholder !== '📣吧啦吧啦亿蛤~'
        ? state.replyItem.nick
        : ''
    )
    comment.set(
      'rquote',
      state.showChildCommentPopup && state.textareaPlaceholder !== '📣吧啦吧啦亿蛤~'
        ? state.replyItem.comment
        : ''
    )
    // comment.set('robjectId', state.replyItem.objectId)
    // 1. 直接等于评论 2. 子评论回复，除了名字和id还有子评论内容引用
    comment.set('comment', state.textareaVal)
    comment.set('postId', instance.router?.params.id)
    comment.set('avatar', user.avatar)
    comment.set('location', user.location)
    comment.set('nick', user.nickname)
    comment.set('userId', user.openid)
    // 更新用户表增加回复消息通知
    comment.set('userObjectId', user.objectId)
    comment.set('like', 0)
    comment.set('likeUser', [])
    comment.set('replyCount', 0)
    comment.set('ua', customGlobalData?.systemInfo.model)
    comment.set('status', 'approved')
    comment.set('url', '')
    // 评论保存接口
    comment.save().then(
      async () => {
        // console.log('发送按钮提交评论数据成功----', res)
        if (state.replyItem.pid && state.replyItem.rid) {
          // 如果是点击评论回复则更新父评论的回复统计数再刷新
          const UpdateReplyCount = await handleUpdateReplyCount()
          console.log('更新回复条数---', UpdateReplyCount)
          // 添加评论通知消息
          const replyNotice = await handleReplyNotice()
          console.log('添加评论通知消息---', replyNotice)
          // 更新回复条数成功刷新评论
          handleCommentInit()
        } else {
          // 刷新评论
          handleCommentInit()
        }
        // 更新用户评论统计表
        handleCommentCount()
				// 更新评论总条数显示
				state.commentTotal++
				// 触发A页面的 events 中的 pullDateFormComment
				eventChannel.emit('pullDateFormComment', { commentTotal: state.commentTotal })
        isClick.value = false
        isLoading.value = false
        // 还原回复对象和父对象,清空textarea值,子评论弹层关闭,关闭表情盒子,还原keyboard高度
        state.parentItem = parentItem
        state.replyItem = replyItem
        state.textareaVal = ''
        state.showChildCommentPopup = false
        state.allSmiles = false
        state.showSmile = false
        // 强制还原为0
        keyboardHeight.value = 0
        state.focus = false
        state.textareaPlaceholder = '📣吧啦吧啦亿蛤~'
        notifySuccess(state.notify, '评论')
      },
      () => {
        // 异常处理
        notifyDanger(state.notify, '评论接口异常')
      }
    )
  }

  const handleFocus = (): void => {
    state.showSmile = true
    state.allSmiles = false
    // 获取显示时的键盘高度给整个表情盒子
    smilesHeight = keyboardHeight.value
    // 校验是否登录
    if (!user) {
      // 删了本地或者第一次
      notifyPrimary(state.notify, '即将跳转登录')
      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/user/index?id=${instance.router.params.id}&date=${instance.router.params.date}&pageTitle=${state.pageTitle}`
        })
      }, 1200)
    } else {
      handleIslogin(state.notify)
    }
  }

  const handleBlur = (e?: { detail: { value: string } }): void => {
    state.showSmile = false
    // 强制还原为0
    keyboardHeight.value = 0
    state.focus = false
    state.textareaVal = e?.detail.value || ''
    // 失去焦点时判断如果值为空则还原为初始
    if (state.textareaVal === '') {
      state.textareaPlaceholder = '📣吧啦吧啦亿蛤~'
      state.parentItem = parentItem
      state.replyItem = replyItem
    }
  }

  const handleClickSmile = (item: { icon: any; text?: string }): void => {
    state.textareaVal += item.icon
  }

  return () => (
    <view class="fixed-bottom-bar">
      <div class="bottom-bar-content" style={`bottom: ${keyboardHeight.value}px`}>
        {/* textarea */}
        <view class="content-textarea">
          <view class="textarea-box">
            <textarea
              value={state.textareaVal}
              placeholder={state.textareaPlaceholder}
              autoHeight={true}
              id="reply-textarea"
              focus={state.focus}
              fixed={true}
              adjustPosition={false}
              onFocus={handleFocus}
              onBlur={e => handleBlur(e)}
              onInput={(e: { detail: { value: string } }) => {
                state.textareaVal = e.detail.value
              }}
            />
          </view>
          <view class="textarea-btn">
            <nut-button
              type="info"
              size="mini"
              loading={isLoading.value}
              class={{
                'btn-throttle': isClick.value,
                'btn-reply': true,
                disabled: !state.textareaVal
              }}
              onClick={handleAvSaveComment}
            >
              发送
            </nut-button>
          </view>
        </view>

        <view class="smile-box">
          <view
            v-show={state.showSmile}
            class="emoji-btn"
            onTap={() => {
              state.allSmiles = true
            }}
          >
            🙂
          </view>
          <view
            v-show={state.allSmiles}
            class="emoji-btn"
            onTap={() => {
              state.allSmiles = false
              state.focus = true
            }}
          >
            ⌨
          </view>
        </view>

        {/* 所有表情 */}
        <div
          class="smile-box all-smiles-box"
          v-show={state.allSmiles}
          style={`height: ${smilesHeight}px;`}
        >
          {/* // click事件不传值就直接写方法名，要传则要完整格式 () => fun() onClick={() => handleSearch(item)} */}
          <nut-grid border={false} column-num={8} clickable={true}>
            {Emoji.container.map((item, index: number) => {
              return (
                <nut-grid-item key={index} onClick={() => handleClickSmile(item)}>
                  <text>{item.icon}</text>
                </nut-grid-item>
              )
            })}
          </nut-grid>
        </div>
      </div>
    </view>
  )
}

/* 
	交互场景： 根据textarea值是否为空和高度还原来判断把replyItem和parentItem还原
		1.点了评论不输入内容，放弃
		2.点了评论输入内容，放弃
		3.直接点textarea
*/
