import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { AppState } from '../reducers';
import { CoursesFacadeService } from './services/courses-facade.service';

@Injectable()
export class CoursesResolver implements Resolve<any> {

  loading = false;
  constructor(private coursesFacadeService: CoursesFacadeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.coursesFacadeService.getAll();
  }
}
