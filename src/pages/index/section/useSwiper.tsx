import { reactive, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// ts申明
import { stateSwiperType, swiperListType } from '../types/index'

export const useSwiper = () => {
  /**
   * 定义变量
	 * @object stateSwiper swiper双向变量
   * 	@param page 默认索引值
   * 	@param list 请求的列表（推荐标识）
   * 	@param getSuccess 请求成功标识，切换显示占位图
	 * @slots 标题插槽
   */
  const stateSwiper: stateSwiperType = reactive({
    // list: [] as string[]
    page: 0,
    list: [],
    getSuccess: false,
    title: ''
  })
  const slots = {
    page: () => {
      return <text class="swiper-title">{stateSwiper.title}</text>
    }
  }

	/**
   * 定义方法
   * @handleSwiperClick 图片点击回调
   * @handleChange 图片切换回调，返回图片序号 index
	 * @handleSwiperInit 推荐文章初始
   */
  const handleSwiperClick = (item: swiperListType): void => {
		Taro.navigateTo({
      // 传过去id和创建时间，因为翻页需要根据时间来做判断
      url: `/pages/post/index?id=${item.id}&createdAt=${item.createdAt}`
    })
  }

  const handleChange = (index: number): void => {
    // state.current = index + 1;
    stateSwiper.title = stateSwiper.list[index].title
  }

	const handleSwiperInit = (): void => {
		const query = new AV.Query('app_post')
    query.equalTo('recommend', 1)
		query.equalTo('status', 'approved')
    query.limit(5)
		query.select('id', 'title', 'img', 'createdAt')
    query.find().then((res: { toJSON: () => any }[]) => {
      stateSwiper.list = res.map((item: { toJSON: () => any }) => {
        return item.toJSON()
      })
      stateSwiper.getSuccess = true
			stateSwiper.title = stateSwiper.list[0].title
    })
	}

  onMounted(() => {
		handleSwiperInit()
  })

  return () => (
    <>
      <view v-show={!stateSwiper.getSuccess}>
        <view class="swiper-placeholder">
          <nut-icon name="image"></nut-icon>
        </view>
      </view>
      <nut-swiper
        init-page={stateSwiper.page}
        pagination-visible={true}
        pagination-color="#426543"
        auto-play="6000"
        class="custom-swiper index-swiper"
        direction="vertical"
        height="190"
        v-show={stateSwiper.getSuccess}
        v-slots={slots}
        onChange={handleChange}
      >
        {stateSwiper.list.map((item: swiperListType, index: number) => {
          return (
            <nut-swiper-item key={index}>
              <image
                src={item.img}
                mode="widthFix"
                defaultSource="https://gumpbobo.github.io/img/loading2.webp"
								onTap={() => handleSwiperClick(item)}
              />
            </nut-swiper-item>
          )
        })}
      </nut-swiper>
    </>
  )
}
