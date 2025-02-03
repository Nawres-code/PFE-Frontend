import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
	
    constructor(private router: Router, private helper:JwtHelperService) {
    	
    }

    canActivate() {
    
        const token = localStorage.getItem('token');
        
        if ( !this.helper.isTokenExpired(token)) {
            return true;
        }

        this.router.navigate(['/signin']);
        return false;
    }

}
