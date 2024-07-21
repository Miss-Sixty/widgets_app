<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'
import normalizeUrl from 'normalize-url';
import { object, string, type InferOutput, safeParser, nonEmpty, pipe, check } from 'valibot';
import type { FormSubmitEvent } from '#ui/types'
import isURL from 'validator/es/lib/isURL'

const appConfig = useAppConfig()
const colorMode = useColorMode()
const primaryColors = computed(() => appConfig.ui.colors.filter(color => color !== 'primary').map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
})
const modelValue = defineModel({ default: false })

watch(modelValue, (bl) => {
  if (!bl) return close()
  for (const key in formData.value) formData.value[key] = props.widget.widgetData[key]
  props.widget.widgetData.iconUrl && icons.value.push(props.widget.widgetData.iconUrl)
  formData.value.iconName = props.widget.widgetData.iconName || '图标名称'
  formData.value.iconBgColor = props.widget.widgetData.iconBgColor || primaryColors.value[0].hex
})

const setBgColor = (color: string | null, type: 1 | 2) => {
  formData.value.iconBgColor = color
  formData.value.iconColorType = type
}

const formRef = ref()
const schema = object({
  url: pipe(string(), nonEmpty('网站地址不能为空'), check(isURL, '请输入正确的网址')),
})
type Schema = InferOutput<typeof schema>;
const baseFormData = {
  url: '',
  name: '',
  iconType: 0,
  iconName: '',
  iconUrl: "",
  host: '',
  iconBgColor: '',
  iconColorType: 1,
}
const formData: any = ref({ ...baseFormData })

const icons: any = ref([])
const isSerach = ref(false)
const loading = ref(false)

const getWebInfo = async () => {
  loading.value = true
  const url = formData.value.url
  clear()
  formData.value.url = url
  try {
    await formRef.value.validate()
    const host = normalizeUrl(formData.value.url, {
      stripHash: true,// 去掉hash
      removeQueryParameters: true,//删除所有查询参数
      stripWWW: false,
      // removePath: true //TODO：等待pr
    })

    formData.value.host = host
    const { data }: any = await $fetch('/api/favicon', {
      method: 'get',
      params: { host },
    })
    isSerach.value = true

    icons.value = data.icons
    const [firstIcon] = data.icons
    if (firstIcon) formData.value.iconUrl = firstIcon
    formData.value.name = data.name
    formData.value.host = data.host
    formData.value.iconName = data.name

    if (data.themeColor && data.themeColor !== '#ffffff' && data.themeColor !== 'white' && data.themeColor !== '#fff') {
      formData.value.iconColorType = 2
      formData.value.iconBgColor = data.themeColor
    } else {
      formData.value.iconBgColor = primaryColors.value[0].hex
    }
  } catch (err) { }
  finally {
    loading.value = false
  }
}

const urlChange = (url: string) => {
  if (!url) clear()
  getWebInfo()
}

// 清空数据
const clear = () => {
  formData.value = { ...baseFormData }
  icons.value = []
  isSerach.value = false
}

const close = () => {
  modelValue.value = false
  clear()
  formRef.value.clear()
}

const radioTabData = [
  { label: '在线图标', },
  { label: '文字图标', },
  // { label: '上传图标', key: 'upload', disabled: true },
]

const tabsChange = (index: number) => {
  formData.value.iconType = index
}
const autoTextSize = computed(() => {
  if (!formData.value.iconName) return {}
  const status: any = {
    1: 26,
    2: 24,
    3: 20,
    4: 16,
    5: 12,
    6: 10
  }

  const length = formData.value.iconName.length
  let fontSize = status[length]
  if (length > 6) fontSize = 10; // Minimum font size
  if (length < 1) return {}

  return {
    fontSize: fontSize + 'px'
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  for (const key in formData.value) props.widget.widgetData[key] = formData.value[key]
  props.widget.widgetData.iconBase64 = ''
  close()
}

</script>

<template>
  <WtabDialog v-model="modelValue" title="网址导航">
    <UForm ref="formRef" class="px-6 pb-6 pt-3 h-full flex flex-col space-y-3" :schema="safeParser(schema)"
      :state="formData" @submit="onSubmit">
      <UFormGroup label="网址" name="url">
        <div class="flex gap-2">
          <UInput class="flex-1" v-model="formData.url" @change="urlChange" />
          <UButton type="primary" :loading="loading" label="获取图标" @click.stop="getWebInfo" />
        </div>
      </UFormGroup>

      <UFormGroup label="网站名称" name="name">
        <UInput v-model="formData.name" />
      </UFormGroup>

      <UTabs v-model="formData.iconType" :items="radioTabData" class="w-full" @change="tabsChange">
        <template #item="{ index }">
          <UCard>
            <ul class="flex gap-2" v-if="index === 0">
              <li v-if="!icons.length"
                class="text-sm text-gray-400 text-center flex-1 flex flex-col items-center space-y-2">
                <template v-if="loading">
                  <UButton size="xl" :padded="false" color="gray" variant="link" :loading="loading" />
                  <span>获取网址信息中...</span>
                </template>

                <template v-else>
                  <template v-if="!formData.url || !isSerach">
                    <UIcon class="text-2xl" name="solar:gallery-broken" />
                    <span>请输入网址后获取图标</span>
                  </template>
                  <template v-if="formData.url && !icons.length && isSerach">
                    <UIcon class="text-2xl" name="solar:gallery-remove-linear" />
                    <span>暂无图标</span>
                  </template>
                </template>
              </li>
              <template v-else>
                <li v-for="(item, i) in icons" :key="i" :class="formData.iconUrl === item ? 'border-primary' : ''"
                  @click="formData.iconUrl = item" class="border rounded-md overflow-hidden flex items-center justify-center
                    p-1.5 h-[78px] w-[78px] cursor-pointer">
                  <img v-if="item" class="size-full" :src="item">
                </li>
              </template>
            </ul>

            <div class="space-y-3" v-if="index === 1">
              <UFormGroup label="图标名称" name="iconName">
                <UInput v-model="formData.iconName" />
              </UFormGroup>

              <UFormGroup label="背景色" name="iconName">
                <div class="flex justify-between gap-2 mt-2">
                  <button class="h-4 w-4 rounded-full  ring-primary ring-offset-1 " v-for="item in primaryColors"
                    :key="item.hex" :style="{ backgroundColor: item.hex }"
                    :class="[formData.iconBgColor === item.hex ? 'ring-2' : '']" @click="setBgColor(item.hex, 1)" />

                  <div class="h-4 w-4 rounded-full bg-primary relative ring-primary ring-offset-1"
                    style="background: conic-gradient(red, #ff4d00, #ff9900, #ffe600, #ccff00, #80ff00, #33ff00, #00ff1a, #00ff66, #00ffb3, aqua, #00b3ff, #0066ff, #001aff, #3300ff, #8000ff, #cc00ff, #ff00e6, #ff0099, #ff004d, red)"
                    :class="[formData.iconColorType === 2 ? 'ring-2' : '']">
                    <input type="color" @input="setBgColor($event.target?.value, 2)" class="opacity-0 inset-0 absolute
                        cursor-pointer" />
                  </div>
                </div>
              </UFormGroup>

              <div
                :style="[autoTextSize, { backgroundColor: formData.iconBgColor, borderColor: formData.iconBgColor, textShadow: '0 0 4px #0000004d' }]"
                class="border rounded-md overflow-hidden flex items-center justify-center text-white
                p-1.5 h-[78px] w-[78px] border-primary cursor-pointer text-center">
                <span class="truncate font-medium">{{ formData.iconName }}</span>
              </div>
            </div>
          </UCard>
        </template>
      </UTabs>
    </UForm>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="solid" color="white" @click="close"> 取 消 </UButton>
        <UButton type="submit"> 确 定 </UButton>
      </div>
    </template>
  </WtabDialog>
</template>
