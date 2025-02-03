import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { SigninService } from '../service/signin.service';
import { User } from '../../authenification/credentials';

@Injectable()
export class ReadOnlyGuard implements CanActivate {
	
    constructor(private router: Router, private signinService: SigninService) {
    	
    }

    canActivate() {
        const user: User = JSON.parse(localStorage.getItem('currentUser'));
        if (user.roles.indexOf("ROLE_COPY_RO") < 0) {
            return true;
        }
        this.router.navigate(['/pages/404']);
        // return false;
    }

}
