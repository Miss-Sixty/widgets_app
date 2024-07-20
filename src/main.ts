import './styles/index.css'
import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'

const app = createApp(App)

const modules: any = import.meta.glob('@/views/**/index.vue')
for (const path in modules) {
  const match = path.match(/\/([^\/]*)\/index\.vue$/);
  if (match) {
    const parentFolderName = match[1];
    const componentName = `Widget${parentFolderName.charAt(0).toUpperCase() + parentFolderName.slice(1)}`;
    app.component(componentName, defineAsyncComponent(modules[path]))
  }
}


app.mount('#app')
