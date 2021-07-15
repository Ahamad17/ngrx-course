import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {EditCourseDialogComponent} from '../edit-course-dialog/edit-course-dialog.component';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import { CoursesFacadeService } from '../services/courses-facade.service';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    @Output()
    courseChanged = new EventEmitter();

    constructor(
      private dialog: MatDialog, private coursesFacade: CoursesFacadeService) {
    }

    ngOnInit() {

    }

    editCourse(course: Course) {

        const dialogConfig = defaultDialogConfig();

        dialogConfig.data = {
          dialogTitle: 'Edit Course',
          course,
          mode: 'update'
        };

        this.dialog.open(EditCourseDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => this.courseChanged.emit());

    }

  onDeleteCourse(course: Course) {
    this.coursesFacade.delete(course);
  }

}









