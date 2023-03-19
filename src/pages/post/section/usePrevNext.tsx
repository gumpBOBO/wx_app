// import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// 公共方法
import { notifyPrimary } from '../../common/commonFun'
// ts申明
import { indexStateType } from '../types/index'

export const usePrevNext = (state: indexStateType, instance: any) => {
  /**
   * 定义方法
   * @handlePrev 上一条
   * @handleJumpComment 跳转到评论页，传过去id,title,author,img
   */
  const handlePrev = (): void => {
    const query = new AV.Query('app_post')
    query.lessThan('createdAt', new Date(instance.router.params.createdAt))
    query.select('id')
    query.limit(1)
    query.find().then(res => {
      // console.log('prev-------res', res)
      if (res.length > 0) {
        // 不为空则跳转
        // console.log('prev-----', res[0].toJSON())
        Taro.redirectTo({
          // 传过去id和创建时间，因为翻页需要根据时间来做判断
          url: `/pages/post/index?id=${res[0].toJSON().id}&createdAt=${res[0].toJSON().createdAt}`
        })
      } else {
        notifyPrimary(state.notify, '已经到头了~')
      }
    })
  }

  const handleNext = (): void => {
    const query = new AV.Query('app_post')
    // query.equalTo('id', instance.router.params.id)
    query.greaterThan('createdAt', new Date(instance.router.params.createdAt))
    query.select('id')
    query.limit(1)
    query.find().then(res => {
      if (res.length > 0) {
        // 不为空则跳转
        // console.log('next-----', res[0].toJSON())
        Taro.redirectTo({
          // 传过去id和创建时间，因为翻页需要根据时间来做判断
          url: `/pages/post/index?id=${res[0].toJSON().id}&createdAt=${res[0].toJSON().createdAt}`
        })
      } else {
        notifyPrimary(state.notify, '已经到底了~')
      }
    })
  }

  return () => (
    <nut-cell class="prev-next-box">
      <view onClick={handlePrev} class={{ disabled: !state.getPostCode }}>
        上一篇
      </view>
      <view onClick={handleNext} class={{ disabled: !state.getPostCode }}>
        下一篇
      </view>
    </nut-cell>
  )
}
