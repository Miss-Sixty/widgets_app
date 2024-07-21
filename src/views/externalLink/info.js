export default {
  key: 'externalLink',
  name: '外链',
  text: '点击后可跳转到指定网址',
  shadow: false,
  data: {
    url: '',
    name: '',
    host: '',
    iconType: 0,
    iconUrl: '',
    iconName: '',
    iconBgColor: '',
    iconColorType: 1,//0:固定色 1:自选色
  },
  sizes: [
    {
      size: '1:1'
    }
  ]
}