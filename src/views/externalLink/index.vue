<script setup lang="ts">
import SettingDialog from "./settingDialog.vue";
const props = defineProps({
  widget: {
    type: Object,
    default: () => ({}),
  },
  type: { // 删除-del 新增-add ''-展示
    type: String,
    default: '',
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


const widgetData = computed(() => props.widget.widgetData || {})
function toUrl() {
  if (props.dragging) return
  if (props.type || (!widgetData.value.url)) return settingDialogVisible.value = true
  const { url, host } = widgetData.value
  window.open(host || url)
}

const autoTextSize = computed(() => {
  if (!widgetData.value.iconName) return {}
  const status: any = {
    1: 26,
    2: 24,
    3: 20,
    4: 16,
    5: 12,
    6: 10
  }

  const length = widgetData.value.iconName.length
  let fontSize = status[length]
  if (length > 6) fontSize = 10; // Minimum font size
  if (length < 1) return {}

  return {
    fontSize: fontSize + 'px'
  }
})
const settingDialogVisible = ref(false)
defineExpose({ settingDialogVisible })
</script>

<template>
  <div :title="widgetData.name" @click="toUrl" :style="{
    backgroundColor: widgetData.iconBgColor,
  }" class="size-full cursor-pointer bg-white rounded-xl flex items-center justify-center overflow-hidden">
    <img v-if="widgetData.iconUrl && widgetData.iconType === 0" draggable="false" class="select-none size-full"
      :src="widgetData.iconUrl">
    <span v-else="widgetData.iconType === 1" class="text-white" :style="autoTextSize">
      {{ widgetData.iconName }}
    </span>

    <SettingDialog v-model="settingDialogVisible" />
  </div>
</template>
