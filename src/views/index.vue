<script setup lang="ts">
const props = window.$wujie?.props;
const route = useRoute()
const nameComp = computed(() => props?.name || route.query.name)
</script>

<template>
  <component v-if="nameComp" :is="`Widget${nameComp.charAt(0).toUpperCase() + nameComp.slice(1)}`" />
  <div v-else>无小组件</div>
</template>
