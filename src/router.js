import Vue    from 'vue'
import Router from 'vue-router'
import Home   from './components/Home'
import Planning   from './components/Planning'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '*',
      redirect: {name: 'Home'},
    },
    {
      path: '/planning/:room',
      component: Home
    },
    {
      name: 'planning',
      path: '/planning/:room/:name',
      component: Planning
    },
  ],
})
