import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User } from '../../authenification/credentials';

@Injectable()
export class ReadOnlyGuardController implements CanActivate {

    constructor(private router: Router) {

    }

    canActivate() {
        const user: User = JSON.parse(localStorage.getItem('currentUser'));
        if (user.roles.indexOf("ROLE_CONTROL") < -1) {
            return true;
        }
        this.router.navigate(['/pages/404']);
        // return false;
    }

}
