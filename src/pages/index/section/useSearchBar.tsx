// vue3写法：导入双向对象， ,onMounted
import { ref } from 'vue'
// ts申明
import { indexStateType, handleSearchType } from '../types/index'

export const useSearchbar = (state: indexStateType, customGlobalData: any) => {
  const stylePopup = {
    width: '100%',
    height: '33%'
  }

  /**
   * 变量和插槽
   * @string searchValue 查询值
   * @array quickSearchItem 快速查询标签
   * @slots searchSlots 自定义插槽
   */
  const searchValue = ref('')
  const quickSearchItem: Array<string> = [
    'github',
    'nodejs',
    'vue3',
    'typescript',
    'taro',
    'hexo',
    '前端',
    '歌词'
  ]
  const searchSlots = {
    leftin: () => {
      return <nut-icon size="14" name="search2"></nut-icon>
    }
    // rightout: () => {
    //   return <text>搜索</text>
    // }
  }

  /**
   * 定义方法
	 * @handleSearch 查询回调
   * 	@默认 点击回车按钮查询，直接获取searchValue
   * 	@param quickSearchValue 快捷查询则根据传入的值判断，如果传入则绑定给searchValue
   */
  const handleSearch: handleSearchType = quickSearchValue => {
    searchValue.value = quickSearchValue || searchValue.value
    console.log(
      '把searchValue存入pinia，跳转到搜索页，取出pinia中的searchValue，输出渲染文章列表，默认10条，下拉再加载',
      searchValue.value
    )
  }

  return () => (
    <nut-popup
      position="top"
      style={stylePopup}
      v-model:visible={state.showSearchPopup}
      pop-class="search-popup"
      lock-scroll={true}
    >
      <div style={`height: ${customGlobalData.systemInfo.statusBarHeight}px`}></div>
      <nut-searchbar
        v-model={searchValue.value}
        v-slots={searchSlots}
        class="top-searchbar"
        style={`padding-right: ${customGlobalData.topbarPaddingR + 20}px; height: ${
          customGlobalData.topbarHeight
        }px;`}
				onSearch={handleSearch}
      ></nut-searchbar>

      <nut-grid column-num={3} border={false} clickable={true}>
        {quickSearchItem.map((item: string, index: number) => {
          return (
            // click事件不传值就直接写方法名，要传则要完整格式 () => fun()
            <nut-grid-item key={index} onClick={() => handleSearch(item)}>
              <text>{item}</text>
            </nut-grid-item>
          )
        })}
      </nut-grid>
    </nut-popup>
  )
}
