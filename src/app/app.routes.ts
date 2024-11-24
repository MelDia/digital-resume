import { Routes } from '@angular/router';
import { LoaderComponent } from './features/components/loader/loader.component';
import { HomeComponent } from './pages/home/home.component';
import { TaskbarComponent } from './features/components/taskbar/taskbar.component';

export const routes: Routes = [
    { path: 'loader', component: LoaderComponent },
    { path: 'taskbar', component: TaskbarComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
