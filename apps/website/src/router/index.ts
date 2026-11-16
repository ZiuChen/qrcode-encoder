import { createRouter, createWebHistory } from 'vue-router'
import DemoView from '@/views/DemoView.vue'
import ToolView from '@/views/ToolView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'demo', component: DemoView },
    { path: '/tool', name: 'tool', component: ToolView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
