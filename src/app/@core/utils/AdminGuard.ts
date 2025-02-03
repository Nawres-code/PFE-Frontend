import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { SigninService } from '../../@core/service/signin.service';
import { User } from '../../authenification/credentials';

@Injectable()
export class AdminGuard implements CanActivate {
	
    constructor(private router: Router, private signinService: SigninService) {
    	
    }

    canActivate() {
        const user: User = JSON.parse(localStorage.getItem('currentUser'));

        if(user.roles.indexOf("ROLE_ADMIN")>-1 && this.signinService.isRootAdmin()) {
            return true;
        } 
        else if (user.roles.indexOf("ROLE_SUPER_ADMIN") >-1) {
            return true;
        }
        this.router.navigate(['/signin']);
        // return false;
    }

}
