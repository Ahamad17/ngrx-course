import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { CoursesDataFacadeService } from './NgRx-Data.service';

@Injectable()
export class CoursesFacadeService {
  beginnerCourses$ = this.coursesService.beginnerCourses$;

  advancedCourses$ = this.coursesService.advancedCourses$;

  promoTotal$ = this.coursesService.promoTotal$;

  constructor(private coursesService: CoursesDataFacadeService) { }

  getAll() {
    return this.coursesService.getAll();
  }

  find(courseUrl) {
    return this.coursesService.find(courseUrl);
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
