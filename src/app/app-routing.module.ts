import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesComponent } from './components/countries/countries.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {path : '', component: HomeComponent},
  {path : 'countries', component: CountriesComponent},
  {path : 'list', component: ListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
