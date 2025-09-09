import {Routes, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {ActiveUser} from "./stores/active_user";

export const authGuard = (
  route: any,
  state: { url: string }
): boolean | UrlTree => {
  const activeUser = inject(ActiveUser);
  const router = inject(Router);

  const userData = activeUser.get();

  if (userData) return true;

  if (state.url.startsWith('/auth/register')) return true;

  return router.createUrlTree(['/auth/login']);
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'sets',
        loadComponent: () =>
          import('./pages/sets/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'sets/:setId',
        loadComponent:
          () =>
            import('./pages/sets/set/set.component').then(m => m.MainComponent),
      },
      {
        path: 'sets/:setId/learn',
        loadComponent: () =>
          import('./pages/sets/learn/learn.component').then(m => m.LearnComponent),
      },
      {
        path: "tasks",
        loadComponent: () =>
          import('./pages/tasks/home/home.component').then(m => m.HomeComponent),
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () => AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
      },
    ]
  },
  {
    path: '**',
    redirectTo: '', // fallback
  }
];
