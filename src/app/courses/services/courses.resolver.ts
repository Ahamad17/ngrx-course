import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CoursesFacadeService } from './courses-facade.service';


@Injectable()
export class CoursesResolver implements Resolve<boolean> {

  constructor(private courseFacade: CoursesFacadeService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.courseFacade.getAll();
  }
}
