import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddReviewComponent } from './pages/add-review/add-review.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'add-review', component: AddReviewComponent, canActivate: [authGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '**', redirectTo: '' }
];
