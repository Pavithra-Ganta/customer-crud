import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { ShowComponent } from './users/show/show.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddressComponent } from './address/address.component';

export const routes: Routes = [
    {
        path:"",
        component:LoginComponent
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"users",
        component:UsersComponent
    },
    {
        path:"users/add",
        component:UserFormComponent 
    },
    {
        path:"users/signup",
        component:UserFormComponent 
    },
    {
        path:"users/:id",
        component:UserFormComponent
    },
    {
        path:"dashboard",
        component:DashboardComponent
    },
    {
        path:"address/:id",
        component:AddressComponent
    },
    {
        path:"users/show/:id",
        component:ShowComponent
    }
];
