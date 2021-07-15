import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {compareCourses, Course} from '../model/course';
import {Observable} from 'rxjs';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditCourseDialogComponent} from '../edit-course-dialog/edit-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import { CoursesFacadeService } from '../services/courses-facade.service';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

    promoTotal$: Observable<number>;

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;


    constructor(
      private dialog: MatDialog, private coursesFacade: CoursesFacadeService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {

    this.beginnerCourses$ = this.coursesFacade.beginnerCourses$;

    this.advancedCourses$ = this.coursesFacade.advancedCourses$;

    this.promoTotal$ = this.coursesFacade.promoTotal$;

  }

  onAddCourse() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Create Course',
      mode: 'create'
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);

  }


}
