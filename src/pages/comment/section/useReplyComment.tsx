// 公共方法
import { handleHideSmile } from '../../common/commonFun'
// ts申明
import { indexStateType, commentType } from '../types/index'

export const useReplyComment = (state: indexStateType, handleLike: (item: commentType) => void) => {
  const stylePopup = {
    width: '100%',
    height: '75%'
  }

  /**
   * 定义方法
   * @handleFocusTextarea 点击评论回复触发textarea焦点
   */
  const handleFocusTextarea = (item: commentType): void => {
    state.focus = true
    // 判断回复的这条评论是否子评论，pid为空则赋值新的，不为空则不修改
    state.replyItem = item
    state.replyItem.pid = !item.pid ? item.objectId : item.pid
    state.replyItem.rid = item.objectId
    state.textareaPlaceholder = `@${item.nick}:`
  }

  return () => (
    <nut-popup
      position="top"
      style={stylePopup}
      v-model:visible={state.showChildCommentPopup}
      pop-class="top-popup"
      round
    >
      <view class="popup-comment" onClick={() => handleHideSmile(state)}>
        {/* 父评论 */}
        <div class="comment-box comment-reply">
          <view class="comment-avatar-box">
            <nut-avatar size="normal" icon={state.parentItem.avatar} shape="round"></nut-avatar>
            <view class="comment-avatar-info">
              <text>{state.parentItem.nick}</text>
              <text class="date-address">
                <text class="date-text">{state.parentItem.createdAt.split('T')[0]}</text>
                {state.parentItem.location}&nbsp;{state.parentItem.ua}
              </text>
            </view>
          </view>
          <view class="comment-content">
            <view class="comment-text">{state.parentItem.comment}</view>
            <view class="comment-reply-like">
              <view class="reply-box"></view>
              <view class="like-box">
                <nut-icon name="follow"></nut-icon>
                {state.parentItem.like || ''}
              </view>
            </view>
          </view>
        </div>

        <view class="comment-title">
          <text>全部回复({state.replyComment.length || ''})</text>
        </view>
        {state.replyComment.map((item: commentType, index: number) => {
          return (
            <div class="comment-box" key={index}>
              <view class="comment-avatar-box">
                <nut-avatar size="normal" icon={item.avatar} shape="round"></nut-avatar>
                <view class="comment-avatar-info">
                  <text>{item.nick}</text>
                  <text class="date-address">
                    <text class="date-text">{item.createdAt.split('T')[0]}</text>
                    {item.location}&nbsp;{item.ua}
                  </text>
                </view>
              </view>
              <view class="comment-content">
                <view class="comment-text" onTap={() => handleFocusTextarea(item)}>
                  <text>{item.comment}</text>
                  <blockquote v-show={item.rnick}>
                    <a href={`#${item.rid}`}>{`@${item.rnick}`}</a>
                    <text>{item.rquote}</text>
                  </blockquote>
                </view>
                <view class="comment-reply-like">
                  <view class="reply-box"></view>
                  <view class="like-box" onTap={() => handleLike(item)}>
                    <nut-icon name="follow"></nut-icon>
                    {item.like || ''}
                  </view>
                </view>
                <view
                  class="comment-border"
                  v-show={index !== state.replyComment.length - 1}
                ></view>
              </view>
            </div>
          )
        })}
        <view class="padding-bottom20"></view>
      </view>
    </nut-popup>
  )
}