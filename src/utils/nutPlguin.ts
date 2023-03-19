import App from './createApp'
import {
  Button,
  Cell,
  CellGroup,
  Icon,
  Tag,
  Tabbar,
  TabbarItem,
  SearchBar,
  Tabs,
  TabPane,
  Avatar,
	AvatarGroup,
  Empty,
  Skeleton,
  Navbar,
  Popup,
  OverLay,
  Grid,
  GridItem,
  Swiper,
  SwiperItem,
  TextArea,
	Notify,
	NoticeBar,
  // 因为项目初始选择了stylus导致sass的变量报错无法使用nutui的布局组件
  // Layout,
  // Row,
  // Col
} from '@nutui/nutui-taro'

App.use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(Icon)
  .use(Tag)
  .use(Tabbar)
  .use(TabbarItem)
  .use(SearchBar)
  .use(Tabs)
  .use(TabPane)
  .use(Avatar)
	.use(AvatarGroup)
  .use(Empty)
  .use(Skeleton)
  .use(Navbar)
  .use(Popup)
  .use(OverLay)
  .use(Grid)
  .use(GridItem)
  .use(Swiper)
  .use(SwiperItem)
  .use(TextArea)
	.use(NoticeBar)
	.use(Notify)
	