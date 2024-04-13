import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TemplatesService } from '../service/templates.service';
import { Template } from '../model/template';

@Component({
  selector: 'app-template-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './template-details.component.html',
  styleUrl: './template-details.component.css'
})
export class TemplateDetailsComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  location: Location = inject(Location);
  templatesService = inject(TemplatesService);
  template: Template | undefined;
  readonly = true;
  nameFC = new FormControl('')


  constructor() {
      const templateId = this.route.snapshot.params['templateId'];
      if (templateId === undefined) {
        this.onEdit();
      } else {
        this.templatesService.findById(Number(templateId))
        .subscribe(
          template => {
            this.template = template;
            this.reload();
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
    this.nameFC.setValue(this.template?.name ?? '');
  }

  onSave() {
    this.readonly = true;
    if (this.template === undefined) {
      this.template = { name: this.nameFC.value ?? '' };
      this.templatesService.create(this.template).subscribe(template => {
        this.template = template;
        this.reload();
        });
    } else {
      this.template.name = this.nameFC.value ?? '';
      this.templatesService.update(this.template).subscribe(template => {
        this.template = template;
        this.reload();
        });
    }
  }

  onDelete() {
    if (this.template !== undefined && this.template.id !== undefined) {
      this.templatesService.delete(this.template.id).subscribe(() => {this.router.navigate(["templates"]);});
    }
  }

  onBack() {
    this.location.back();
  }

  reload() {
    this.nameFC.setValue(this.template?.name ?? '');
  }
}
