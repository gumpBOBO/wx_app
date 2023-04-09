// import { ref } from 'vue'
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'
import { notifyPrimary } from '../../common/commonFun'
// ts申明
import { indexStateType } from '../types/index'

export const useUserInfo = (state: indexStateType, handleFollow?: () => void) => {
  const user = AV.User.current()?.toJSON()

  /**
   * 定义方法
   * @handleEditMyInfo 编辑我的信息
   * @handleBgError 照片墙地址错误回调
   */

  const handleEditMyInfo = (): void => {
    notifyPrimary(state.notify)
    state.notify.msg = '小波玩命开发中...'
    // 跳转到编辑信息页面
  }
  const handleBgError = (res: { type: string }) => {
    if (res.type === 'error' && user) {
      state.myInfo.myBgUrl =
        'http://p1.music.126.net/QMciargoIQS3RrTGjFDuJA==/109951168222519134.jpg'

      const avUser = AV.Object.createWithoutData('_User', user.objectId)
      avUser.set('myBgUrl', state.myInfo.myBgUrl)
      avUser.save().then(
        () => {
          notifyPrimary(state.notify)
          state.notify.msg = '照片地址错误,恢复默认'
          // 更新本地和更新用户表
          const { nickname, location, avatar, myBgUrl } = state.myInfo
          // 存本地
          Taro.setStorage({
            key: 'myInfo',
            data: { nickname, location, avatar, myBgUrl }
          })
        },
        error => {
          // 异常处理
          console.log(error)
        }
      )
    }
  }

  return () => (
    <>
      {/* 照片墙 */}
      <view class="mybg-box">
        <image
          src={state.myInfo.myBgUrl}
          mode="widthFix"
          defaultSource="https://gumpbobo.github.io/img/loading2.webp"
          onError={handleBgError}
          onTap={() => {
            state.pageTitle === 'My' ? (state.showChangeBgPopup = true) : ''
          }}
        />
      </view>

      {/* 用户信息 */}
      <nut-cell class="my-info">
        <view class="my-info-avatar my-info-item">
          <nut-avatar size="large" icon={state.myInfo.avatar} shape="round"></nut-avatar>
        </view>
        <view class="my-info-item">
          <text class="my-info-name">{state.myInfo.nickname}</text>
          {/* <nut-icon size="40" name={state.myInfo.medal}></nut-icon> */}
        </view>
        <view class="my-info-item" v-show={state.isShow}>
          <view>
            <nut-icon name="addfollow" class="my-info-icon"></nut-icon>
            关注<text class="italic">{state.myInfo.concern}</text>
          </view>
          <view class="margin-l-r-20 my-info-follow">
            <nut-icon name="add" class="my-info-icon"></nut-icon>
            粉丝<text class="italic">{state.myInfo.follow}</text>
          </view>
          <view>
            <nut-icon name="comment" class="my-info-icon"></nut-icon>
            lv.<text class="lv-text">{state.myInfo.lv}</text>
          </view>
        </view>
        <view class="my-info-item">
          <view
						// 用户页面state接口才返回了 openid : 如果被关注或者是自己则禁用
            class={{
              'my-info-addr': true,
              disabled:
                state.followee.includes(state.myInfo.openid || '') ||
                (user && state.myInfo.openid === user.openid)
            }}
            v-show={state.pageTitle === 'UserInfo'}
            onTap={handleFollow}
          >
            {state.followee.includes(state.myInfo.openid || '') ? '已关注' : '关注ta'}
          </view>
          <text class="my-info-addr">{`IP属地: ${state.myInfo.location}`}</text>
          <nut-icon
            name="rect-right"
            class="padding-l-r5"
            v-show={state.pageTitle === 'My'}
            onClick={handleEditMyInfo}
          ></nut-icon>
        </view>
      </nut-cell>
    </>
  )
}
