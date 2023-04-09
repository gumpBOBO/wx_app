import { watch, reactive, ref } from 'vue'
import Taro, { useReachBottom } from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'

// 公共方法
import { notifyPrimary } from '../../common/commonFun'
// ts申明
import { indexStateType, listObjType, listType } from '../types/index'

export const useList = (state: indexStateType) => {
  /**
   * 定义变量
   * @object listObj 文章数据双向对象
   * @string getListCode 接口返回状态码，判断空状态
   */
  const listObj: listObjType = reactive({
    list: [],
    total: 0,
    listCount: 0
  })
  const isMoreLoading = ref<boolean>(false)

  /**
   * 定义方法
   * @handleTotal 总条数
   * @handleInitList 初始或切换tab获取文章接口
   * @handleGetMoreList 触底上拉更多文章
   * @handleJumpPage 跳转到文章页，传过去id
   */
  const handleTotal = (categoryCode?: string): void => {
    const query = new AV.Query('app_post')
    query.notEqualTo('recommend', 1)
		query.equalTo('status', 'approved')
    if (categoryCode) {
      query.equalTo('categoryCode', categoryCode)
    }
    query.count().then((count: number) => {
      listObj.total = count
    })
  }

  const handleInitList = (categoryCode?: string): void => {
    const query = new AV.Query('app_post')
    query.notEqualTo('recommend', 1)
		query.equalTo('status', 'approved')
    query.limit(5)
    query.descending('createdAt')
    if (categoryCode) {
      query.equalTo('categoryCode', categoryCode)
    }
    query.select(
      'img',
      'title',
      'description',
      'like',
      'avatar',
      'author',
      'visite',
      'category',
      'id',
      'createdAt'
    )
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
        listObj.list = res.map((item: { toJSON: () => any }) => item.toJSON())
        // 用来累加计数翻页忽略条数
        listObj.listCount = res.length
      } else {
        listObj.list = []
      }
      state.getListCode = '200'
      // 测试不同返回code
      // if (categoryCode === 'essay') {
      // 	getListCode.value = '401'
      // } else if (categoryCode === 'movie') {
      // 	getListCode.value = '500'
      // }
      console.log('list初始数据--------', listObj.list)
    })
    handleTotal(categoryCode)
  }

  const handleGetMoreList = (categoryCode?: string): void => {
    isMoreLoading.value = true
    const query = new AV.Query('app_post')
    query.notEqualTo('recommend', 1)
		query.equalTo('status', 'approved')
    query.limit(5)
    query.descending('createdAt')
    // 忽略已拿到的数据条数和排除置顶的实现翻页
    query.skip(listObj.listCount)
    if (categoryCode) {
      query.equalTo('categoryCode', categoryCode)
    }
    query.select(
      'img',
      'title',
      'description',
      'like',
      'avatar',
      'author',
      'visite',
      'category',
      'id',
      'createdAt'
    )
    query.find().then((res: { toJSON: () => any }[]) => {
      if (res.length > 0) {
        res.map((item: { toJSON: () => any }) => {
          listObj.list.push(item.toJSON())
        })
        listObj.listCount += res.length
      }
      state.getListCode = '200'
      console.log('上拉加载--------', res)
      // 防止多次请求
      setTimeout(() => {
        isMoreLoading.value = false
      }, 300)
    })
  }

  const handleJumpPage = (item: listType): void => {
    Taro.navigateTo({
      // 传过去id和创建时间，因为翻页需要根据时间来做判断
      url: `/pages/post/index?id=${item.id}&createdAt=${item.createdAt}`
    })
  }

  /**
   * 交互操作&调用
   * @watch state.tabValue 监听tab切换标识调用文章不同接口
   * @handleInitList 初始最新文章列表 *5
   * @useReachBottom 监听用户上拉动作
   */
  watch(
    () => state.tabValue,
    () => {
      // newVal, oldVal
      if (state.tabValue !== 'new') {
        handleInitList(state.tabValue)
      } else {
        handleInitList()
      }
    }
  )
  useReachBottom(() => {
    // 1.丢弃小数部分,保留整数部分
    // parseInt(5/2)
    // 2.向上取整,有小数就整数部分加1
    // Math.ceil(5/2)
    // TODO: 初始拿到总条数，然后每次上拉刷新push后和list.length比较
    if (listObj.listCount >= listObj.total) {
      notifyPrimary(state.notify, '没有啦,没有啦啦~')
      return
    }
    // 防止多次请求
    if (!isMoreLoading.value) {
      if (state.tabValue !== 'new') {
        handleGetMoreList(state.tabValue)
      } else {
        handleGetMoreList()
      }
    }
  })
  handleInitList()

  return () => (
    <>
      <nut-skeleton
        class={['list-item-skeleton']}
        width="375px"
        height="35px"
        title
        animated
        row="4"
        loading={!state.getListCode}
        round
      >
        {/* TODO: 根据接口返回的code再增加错误提示和无网络提示 */}
        {listObj.list.length > 0 ? (
          listObj.list.map((item: listType, index: number) => {
            return (
              <nut-cell class="list-item-custom" key={index}>
                {/* 访问大于1000则显示emoji火图标, 非最新tab的则不显示分类名称 */}
                {/* <view class="list-item-category" v-show={state.tabValue === 'new'}>
                  <view>
                    <text v-show={item.visite >= 500}>🔥</text>- {item.category} -
                  </view>
                </view> */}
                <view class="list-item-img-box" onTap={() => handleJumpPage(item)}>
                  <image
                    src={item.img}
                    mode="widthFix"
                    defaultSource="https://gumpbobo.github.io/img/loading2.webp"
                  />
                  <text class="list-item-title">{item.title}</text>
                </view>
                <view onTap={() => handleJumpPage(item)}>
                  <text class="list-item-description">{item.description}</text>
                </view>
                <view class="list-item-info-box">
                  <view class="avatar-box">
                    <nut-avatar size="small" icon={item.avatar} shape="round"></nut-avatar>
                    <text>{item.author}</text>
                  </view>
                  <view class="list-item-btn-group">
                    <view class="btn-like">
                      <nut-icon name="follow"></nut-icon>
                      {/* 点赞大于99则显示99↑ */}
                      <text class="like-account">{item.like > 99 ? '99🔺' : `${item.like}`}</text>
                    </view>
                    <view class="btn-like">
                      <nut-icon name="eye"></nut-icon>
                      <text class="like-account">{item.visite}</text>
                    </view>
                  </view>
                </view>
              </nut-cell>
            )
          })
        ) : (
          <>
            {/* FIXME: 组件BUG，如果用一个标签渲染切换无法视图更新 */}
            <nut-empty
              image="empty"
              description="暂无内容，投喂小波，助他玩命更新..."
              v-show={state.getListCode === '200'}
            ></nut-empty>
            <nut-empty
              image="error"
              description="加载失败/错误"
              v-show={state.getListCode === '401'}
            ></nut-empty>
            <nut-empty
              image="network"
              description="无网络/网络超时"
              v-show={state.getListCode === '500'}
            >
              <div style="margin-top: 10px">
                <nut-button icon="refresh" type="primary">
                  刷新
                </nut-button>
              </div>
            </nut-empty>
          </>
        )}
      </nut-skeleton>
      <view class="more-loading">
        <nut-icon
          name="loading"
          class="nut-icon-am-rotate nut-icon-am-infinite"
          v-show={isMoreLoading.value}
        ></nut-icon>
      </view>
    </>
  )
}
