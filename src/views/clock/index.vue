<script setup lang="ts">
import SettingDialog from './settingDialog.vue'
const props = defineProps({
  widget: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    required: true,
  },
  dragging: {
    type: Boolean,
    default: false
  }
})

const visibleDialog = ref(false)
const handleSetting = () => {
  visibleDialog.value = true
}
</script>

<template>
  <div class="size-full border">
    widget-clock
    <Button label="设 置" @click="handleSetting" />
    <SettingDialog v-model="visibleDialog" />
  </div>
</template>
