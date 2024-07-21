<script setup lang="ts">
const props = window?.$wujie?.props || {};
console.log(1, props);

const route = useRoute()
const data = computed(() => {
  const obj: any = {}
  for (let key in params) {
    obj[key] = props?.[key] || route.query?.[key]
  }
  return obj
})
const params = {
  name: '',
  size: '',
  widget: '',
  dragging: false,
}
</script>

<template>
  <component v-if="data.name" :is="`Widget${data.name.charAt(0).toUpperCase() + data.name.slice(1)}`"
    :dragging="data.dragging" :size="data.size" :widget="data.widget" />
  <div v-else>无小组件</div>
</template>
