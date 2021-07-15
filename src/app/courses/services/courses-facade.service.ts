import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, EntityCollectionServiceBase, EntityCollectionServiceElementsFactory, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { Course } from '../model/course';

@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<Course> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Course', serviceElementsFactory);
  }
}

@Injectable()
export class CourseDataService extends DefaultDataService<Course> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Course', http, httpUrlGenerator);
  }

  getAll(): Observable<Course[]> {
    return this.http.get('/api/courses').pipe(map(res => res['payload']));
  }
}

@Injectable()
export class CoursesFacadeService {
  beginnerCourses$ = this.coursesService.entities$
    .pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );

  advancedCourses$ = this.coursesService.entities$
    .pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );

  promoTotal$ = this.coursesService.entities$
    .pipe(
      map(courses => courses.filter(course => course.promo).length)
    );

  constructor(private coursesService: CourseEntityService) { }

  getAll() {
    return this.coursesService.loaded$.pipe(tap(loaded => {
      if (!loaded) {
        this.coursesService.getAll();
      }
    }), filter(loaded => !!loaded), first());
  }

  find(courseUrl) {
    return this.coursesService.entities$.pipe(
      map(courses => courses.find(course => course.url === courseUrl)
      ));
  }

  add(course: Course) {
    return this.coursesService.add(course);
  }

  update(course: Course) {
    return this.coursesService.update(course);
  }

  delete(course: Course) {
    return this.coursesService.delete(course);
  }
}
