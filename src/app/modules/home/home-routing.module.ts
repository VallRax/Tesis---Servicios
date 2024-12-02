import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { homePage } from './pages/home/home.page';
import { ServicePage } from './pages/service/service.page';
import { SchedulePage } from './pages/schedule/schedule.page';
import { FavoritesPage } from './pages/favorites/favorites.page';

const routes: Routes = [
  {
    path: '',
    component: homePage
  },
  {
    path: 'service/:id',
    component: ServicePage
  },

  {
    path: 'schedule/:serviceId/:offerId',
    component: SchedulePage,
  },
  {
    path: 'favorites',
    component: FavoritesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
