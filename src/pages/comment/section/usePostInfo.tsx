// 当前页面小公共方法
import { handleHideSmile } from '../../common/commonFun'
// ts申明
import { indexStateType } from '../types/index'

export const usePostInfo = (state: indexStateType, instance: any) => {
  return () => (
    <nut-cell class="post-info-box" onClick={() => handleHideSmile(state)}>
      <image
        src={instance.router?.params.img || ''}
        mode="widthFix"
        defaultSource="https://gumpbobo.github.io/img/loading2.webp"
      />
      <view class="post-info">
        <text class="post-title">{instance.router?.params.title}</text>
        <text class="post-author">文/{instance.router?.params.author}</text>
      </view>
    </nut-cell>
  )
}
