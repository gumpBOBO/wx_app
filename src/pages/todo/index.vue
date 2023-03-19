<script lang="tsx">
import { defineComponent } from 'vue'
// tsx-hook
import { useIndex } from './useIndex'

export default defineComponent({
  // 必须首字母大写
  name: 'Todo',
  components: {},
  setup() {
    const indexHook: () => JSX.Element = useIndex()

    return () => <view>{indexHook()}</view>
  }
})
</script>
