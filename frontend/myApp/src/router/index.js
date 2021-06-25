import { createRouter, createWebHistory } from '@ionic/vue-router';

import Tabs from '@/views/Tabs.vue'
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

import { TokenService } from '@/services/token.service';
// import { AuthService } from "@/services/auth.service";

const routes = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'cars',
        component: () => import('@/views/facilities/List.vue')
      },
      {
        path: 'rides',
        component: () => import('@/views/rides/List.vue')
      },
      {
        path: 'accomodations',
        component: () => import('@/views/accomodations/List.vue')
      },
      {
        path: 'sites',
        component: () => import('@/views/sites/List.vue'),
        meta: { admin: true }
      },
      {
        path: 'facilities',
        component: () => import('@/views/facilities/List.vue'),
        meta: { admin: true }
      },
      {
        path: 'utilities',
        component: () => import('@/views/utilities/List.vue'),
        meta: { admin: true }
      },
      {
        path: 'customers',
        component: () => import('@/views/customers/List.vue'),
        meta: { admin: true }
      },
      // {
      //   path: 'ride',
      //   component: () => import('@/views/OrderRide.vue'),
      //   meta: { admin: true }
      // }
    ]
  },
  // Accomodations
  {
    path: '/accomodations/:id',
    component: () => import('@/views/accomodations/Detail.vue')
  },
  {
    path: '/accomodations/create',
    component: () => import('@/views/accomodations/Create.vue'),
    meta: { admin: true }
  },

  // Sites
  {
    path: '/sites/:id',
    component: () => import('@/views/sites/Detail.vue'),
    meta: { admin: true }
  },
  {
    path: '/sites/create',
    component: () => import('@/views/sites/Create.vue'),
    meta: { admin: true }
  },

   // Facilities
   {
    path: '/ride/:id',
    component: () => import('@/views/facilities/Detail.vue'),
    meta: { admin: true }
  },
  {
    path: '/order/:id',
    component: () => import('@/views/facilities/Create.vue'),
  },
  {
    path: '/facilities/create',
    component: () => import('@/views/facilities/Create.vue'),
    meta: { admin: true }
  },

     // Utilities
     {
      path: '/utilities/:id',
      component: () => import('@/views/utilities/Detail.vue'),
      meta: { admin: true }
    },
    {
      path: '/utilities/create',
      component: () => import('@/views/utilities/Create.vue'),
      meta: { admin: true }
    },

  // Customers
  {
    path: '/customers/:id',
    component: () => import('@/views/customers/Detail.vue'),
    meta: { admin: true }
  },
  {
    path: '/customers/create',
    component: () => import('@/views/customers/Create.vue'),
    meta: { admin: true }
  },

  //reservations
  {
    path: '/reservations/:id',
    component: () => import('@/views/reservations/Detail.vue'),
    meta: { admin: true }
  },

  // Authentication
  // These should be loaded in the initial load chunk, so no lazy loading here.
  {
    path: '/login',
    component: Login,
    meta: { public: true, guest: true }
  },
  {
    path: '/register',
    component: Register,
    meta: { public: true, guest: true }
  },

  // Catch all 404 pages and redirect back to home.
  {
    path: "/:url(.*)",
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const loggedIn = !!TokenService.getToken();



  // Get the types of the current route.
  // const isAdmin = to.matched.some(record => record.meta.admin);
  const isPublic = to.matched.some(record => record.meta.public);
  const isGuest = to.matched.some(record => record.meta.guest);

  if (!isPublic &&!loggedIn) {
    console.log("redirectign");
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }

  if (isGuest && loggedIn) {
    return next("/");
  }

  // const user = await AuthService.getUser();
  // if (isAdmin && !user.is_admin) {
  //   return next("/");
  // }

  next();
});

export default router
