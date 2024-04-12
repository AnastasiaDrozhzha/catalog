import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  templatesService = inject(TemplatesService);
  template: Template | undefined;
  readonly = true;
  nameFC = new FormControl('')


  constructor() {
      const templateId = this.route.snapshot.params['templateId'];
      if (templateId === undefined) {
        this.onEdit();
      } else {
        this.template = this.templatesService.findById(Number(templateId));
      }
      this.nameFC.setValue(this.template?.name ?? '');
  }

  isReadonly() : boolean {
    return this.readonly;
  }

  onEdit() {
    this.readonly = false;
  }

  onCancel() {
    this.readonly = true;
  }

  onSave() {
    this.readonly = true;
    if (this.template === undefined) {
      this.template = { name: this.nameFC.value ?? '' };
      this.template = this.templatesService.create(this.template);
    } else {
      this.template.name = this.nameFC.value ?? '';
      this.template = this.templatesService.update(this.template);
    }
  }

  onDelete() {
    if (this.template !== undefined && this.template.id !== undefined) {
      this.templatesService.delete(this.template.id);
    }
    this.router.navigate(["templates"]);
  }
}
