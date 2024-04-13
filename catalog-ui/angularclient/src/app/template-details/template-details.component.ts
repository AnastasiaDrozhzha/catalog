import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TemplatesService } from '../service/templates.service';
import { Template } from '../model/template';
import { Alertable } from '../model/alertable';
import { handleError } from '../model/errorUtil';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-template-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './template-details.component.html',
  styleUrl: './template-details.component.css'
})
export class TemplateDetailsComponent implements Alertable {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  location: Location = inject(Location);
  templatesService = inject(TemplatesService);
  template: Template | undefined;
  readonly = true;
  nameFC = new FormControl('')
  alertMessage: string = '';


  constructor() {
      const templateId = this.route.snapshot.params['templateId'];
      if (templateId === 'new') {
        this.onEdit();
      } else {
        this.templatesService.findById(Number(templateId))
        .subscribe(
          {next: (template) => {
            this.template = template;
            this.reload();
          },
          error: (err) => {handleError(this, err);}
        }
        );
      }
  }

  isReadonly() : boolean {
    return this.readonly;
  }

  onEdit() {
    this.readonly = false;
  }

  onCancel() {
    this.readonly = true;
    this.reload();
  }

  onSave() {
    if (this.template == undefined) {
      this.template = { name: this.nameFC.value ?? '' };
    }

    if (this.isAdd()) {
      this.templatesService.create(this.template).subscribe({next: (template) => {
        this.template = template;
        this.readonly = true;
        this.reload();
        },
      error: (err) => {handleError(this, err);} });
    } else {
      this.template.name = this.nameFC.value ?? '';
      this.templatesService.update(this.template).subscribe({next: (template) => {
        this.template = template;
        this.readonly = true;
        this.reload();
        },
        error: (err) => {handleError(this, err);} });
    }
  }

  onDelete() {
    if (this.template !== undefined && this.template.id !== undefined) {
      this.templatesService.delete(this.template.id).subscribe({next:() => {this.router.navigate(["templates"]);},
      error: (err) => {handleError(this, err);}});
    }
  }

  onBack() {
    this.location.back();
  }

  isAdd(): boolean {
    return this.template?.id === undefined;
  }

  reload() {
    this.nameFC.setValue(this.template?.name ?? '');
  }

  showAlert(message: string): void {
    this.alertMessage = message;
  }

  clearAlert() {
    this.alertMessage = '';
  }
}
