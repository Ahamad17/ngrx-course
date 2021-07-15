import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createAction, createFeatureSelector, createReducer, createSelector, on, props, select, Store } from '@ngrx/store';
import { compareCourses, Course } from '../model/course';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, finalize, first, map, tap } from 'rxjs/operators';
import { CoursesHttpService } from './courses-http.service';
import { AppState } from '../../reducers';


//actions
export const loadAllCourses = createAction('[Courses Resolver] Load All Courses');

export const allCoursesLoaded = createAction('[Load Courses Effect] All Courses Loaded', props<{ courses: Course[] }>());

export const courseUpdated = createAction('[Edit Course Dialog] Course Updated', props<{ update: Update<Course> }>());

export const courseDeleted = createAction('[Course Card List] Delete Course', props<{ id: number }>());

export const addCourse = createAction('[Edit Course Dialog] Add Course', props<{ course: Course }>());


// reducers
export interface CoursesState extends EntityState<Course> {
  allCoursesLoaded: boolean;
}

export const adapter = createEntityAdapter<Course>({
  sortComparer: compareCourses
});

export const initialCoursesState = adapter.getInitialState({ allCoursesLoaded: false });


export const coursesReducer = createReducer(initialCoursesState,
  on(allCoursesLoaded, (state, action) => adapter.addAll(action.courses, { ...state, allCoursesLoaded: true })),

  on(courseUpdated, (state, action) =>
    adapter.updateOne(action.update, state)),

  on(courseDeleted, (state, action) =>
    adapter.removeOne(action.id, state)),

  on(addCourse, (state, action) =>
    adapter.addOne(action.course, state))
);

export const selectAll = adapter.getSelectors().selectAll;


// selectors
export const selectCoursesState = createFeatureSelector<CoursesState>('courses-entity');

export const selectAllCourses = createSelector(selectCoursesState, selectAll);

export const selectBeginnerCourses = createSelector(
  selectAllCourses,
  courses => courses.filter(course => course.category === 'BEGINNER')
);

export const selectAdvancedCourses = createSelector(
  selectAllCourses,
  courses => courses.filter(course => course.category === 'ADVANCED')
);

export const selectPromoTotal = createSelector(
  selectAllCourses,
  courses => courses.filter(course => course.promo).length
);

export const areCoursesLoaded = createSelector(selectCoursesState, state => state.allCoursesLoaded);

@Injectable()
export class CoursesEffects {
  loadCourses$ = createEffect(() => this.actions$.pipe(
    ofType(loadAllCourses),
    concatMap(action => this.coursesHttpService.findAllCourses()),
    map((courses: Course[]) => allCoursesLoaded({ courses }))
  ));

  saveCourse$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(courseUpdated),
        concatMap(action => this.coursesHttpService.saveCourse(
          action.update.id,
          action.update.changes
        ))
      ),
    { dispatch: false }
  );

  addCourse$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(addCourse),
        concatMap(action => this.coursesHttpService.addCourse(
          action.course
        ))
      ),
    { dispatch: false }
  );

  deleteCourse$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(courseDeleted),
        concatMap(action => this.coursesHttpService.deleteCourse(
          action.id
        ))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private coursesHttpService: CoursesHttpService) { }
}

@Injectable()
export class CoursesEntityFacadeService {
  beginnerCourses$ = this.store.pipe(select(selectBeginnerCourses));
  advancedCourses$ = this.store.pipe(select(selectAdvancedCourses));
  promoTotal$ = this.store.pipe(select(selectPromoTotal));

  loading = false;
  constructor(private store: Store<AppState>) { }

  getAll() {
    return this.store.pipe(
      select(areCoursesLoaded),
      tap(coursesLoaded => {
        if (!this.loading && !coursesLoaded) {
          this.loading = true;
          this.store.dispatch(loadAllCourses());
        }
      }),
      filter(coursesLoaded => coursesLoaded),
      first(),
      finalize(() => this.loading = false));
  }

  add(course: Course) {
    return this.store.dispatch(addCourse({course}));
  }

  find(courseUrl: string) {}

  update(course: Course) {
    const update: Update<Course> = {
      id: course.id,
      changes: course
    };
    return this.store.dispatch(courseUpdated({ update }));
  }

  delete(course: Course) {
    return this.store.dispatch(courseDeleted({id: course.id}));
  }
}
