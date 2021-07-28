import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { Observable, of } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { Course } from '../model/course';
import { CoursesFacadeService } from './courses-facade.service';
import { CoursesHttpService } from './courses-http.service';

export interface CourseState extends EntityState<Course, number> {
  areCoursesLoaded: boolean;
}

export function createInitialState(): CourseState {
  return {
      areCoursesLoaded: false
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'courses' })
export class AkitaCourseStore extends EntityStore<CourseState> {

    constructor() {
        super(createInitialState());
    }

    loadCourses(courses: Course[], areCoursesLoaded: boolean) {
      this.set(courses);
      this.update(state => ({
        ...state,
        areCoursesLoaded
      }));
    }
}


@Injectable({
  providedIn: 'root'
})
export class AkitaCourseQuery extends QueryEntity<CourseState> {

  selectAreCoursesLoaded$ = this.select(state => {
    return state.areCoursesLoaded;
  });

  constructor(protected store: AkitaCourseStore) {
    super(store);
  }
}


@Injectable()
export class AkitaCourseService {
  store: AkitaCourseStore;

  beginnerCourses$ = this.akitaCourseQuery.selectAll({filterBy: entity => entity.category === 'BEGINNER'}) as unknown as Observable<any>;

  advancedCourses$ = this.akitaCourseQuery.selectAll({filterBy: entity => entity.category === 'BEGINNER'}) as unknown as Observable<any>;

  promoTotal$ = this.akitaCourseQuery.selectCount(entity => entity.promo) as unknown as Observable<any>;

  constructor(store: AkitaCourseStore, private coursesHttpService: CoursesHttpService, private akitaCourseQuery: AkitaCourseQuery) {
    this.store = store;
  }

  getAll(): Observable<Course[]> {
    return this.coursesHttpService.findAllCourses().pipe(
      tap(courses => {
        this.store.loadCourses(courses, true);
      })
    );
  }

  add(course: Course) {
    return this.coursesHttpService.addCourse(course).pipe(
      tap((value: Course) => {
        this.store.add([value]);
      })
    );
  }

  delete(course: Course): Observable<any> {
    return this.coursesHttpService.deleteCourse(course.id).pipe(
      tap(result => {
        this.store.remove(course.id);
      })
    );
  }

  find(courseUrl) {}

  update(course: Course): Observable<any> {
    return this.coursesHttpService.saveCourse(course.id, course).pipe(
      tap(result => {
        this.store.update(course.id, course);
      })
    );
  }
}
