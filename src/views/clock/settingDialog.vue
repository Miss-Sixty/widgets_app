<script setup lang="ts">
const visibleDialog = defineModel(false)
</script>

<template>
  <Dialog v-model:visible="visibleDialog" modal header="Edit Profile" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
  </Dialog>
</template>
