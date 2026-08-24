import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Categories from '../views/Categories.vue';
import CategoryDetails from '../views/CategoryDetails.vue';
import Lessons from '../views/Lessons.vue';
import LessonDetails from '../views/LessonDetails.vue';
import Bookmarks from '../views/Bookmarks.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/categories/:slug',
    name: 'CategoryDetails',
    component: CategoryDetails,
    props: true
  },
  {
    path: '/lessons',
    name: 'Lessons',
    component: Lessons
  },
  {
    path: '/lessons/:id',
    name: 'LessonDetails',
    component: LessonDetails,
    props: true
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    component: Bookmarks
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
