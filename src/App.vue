<script setup lang="ts">
const props = window.$wujie?.props; 
</script>

<template>
  <component :is="`Widget${props.name.charAt(0).toUpperCase() + props.name.slice(1)}`" />
</template>
