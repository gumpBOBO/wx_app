<template>
  <view>
    <text class="title">{{ counter.count }}</text>
    <view class="button" @tap="onAdd">ADD</view>
  </view>
</template>

<script>
import { useCounterStore } from '../stores/counter'
// 如果不用setup语法糖，则需要在setup中你哪个return函数方法出去。html才能调用
export default {
  setup() {
    const counter = useCounterStore()

    const onAdd = () => {
      counter.count++

      // with autocompletion ✨
      // counter.$patch({count: counter.count + 1})

      // or using an action instead
      // counter.increment()
    }

    return {
      counter,
      onAdd
    }
  }
}
</script>

<style>
.title {
  font-size: 32px;
}
.button {
  border: 1px solid lightgray;
  padding: 5px 10px;
}
</style>
