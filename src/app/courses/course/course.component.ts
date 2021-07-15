import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { delay, map, tap, withLatestFrom } from 'rxjs/operators';
import { LessonEntityService } from '../services/lesson-entity.service';
import { CoursesFacadeService } from '../services/courses-facade.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  loading$: Observable<boolean>;

  lessons$: Observable<Lesson[]>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;

  constructor(
    private route: ActivatedRoute, private courseFacade: CoursesFacadeService, private lessonService: LessonEntityService) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get('courseUrl');
    this.course$ = this.courseFacade.find(courseUrl);

    this.lessons$ = this.lessonService.entities$.pipe(
      withLatestFrom(this.course$),
      tap(([lessons, course]) => {
        if (this.nextPage === 0) {
          this.loadLessonsPage(course);
        }
      }),
      map(([lessons, course]) => lessons.filter(lesson => lesson.courseId === course.id))
    );

    this.loading$ = this.lessonService.loaded$.pipe(delay(0));

  }


  loadLessonsPage(course: Course) {
    this.lessonService.getWithQuery({
      'courseId': course.id.toString(),
      'pageNumber': this.nextPage.toString(),
      'pageSize': '3'
    });
    this.nextPage += 1;
  }

}
