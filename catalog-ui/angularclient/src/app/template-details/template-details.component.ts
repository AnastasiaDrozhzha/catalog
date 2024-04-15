import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TemplatesService } from '../service/templates.service';
import { Template } from '../model/template';
import { TemplateState } from '../model/template-state';
import { Property } from '../model/property';
import { PropertyType } from '../model/property-type';
import { Alertable } from '../model/alertable';
import { handleError } from '../model/errorUtil';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-template-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, RouterLink],
  templateUrl: './template-details.component.html',
  styleUrl: './template-details.component.css'
})
export class TemplateDetailsComponent implements Alertable {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  location: Location = inject(Location);
  templatesService = inject(TemplatesService);
  template: Template | undefined;
  originalTemplate: Template | undefined;
  readonly = true;
  nameFC = new FormControl('')
  alertMessage: string = '';
  modified = false;

  constructor() {
    const state = window.history.state;
    if (state !== null && state.template !== undefined) {
      this.template = state.template;
      this.setFormValues(this.template);
      this.originalTemplate = state.originalTemplate;
      this.modified = state.modified;
      this.readonly = state.readonly;
    } else {
      const templateId = this.route.snapshot.params['templateId'];
      if (isNaN(Number(templateId))) {
        this.onEdit();
      } else {
        this.templatesService.findById(Number(templateId))
        .subscribe(
          {next: (template) => {
            this.template = template;
            this.rememberOriginalTemplate(template);
            this.reload(template);
          },
          error: (err) => {handleError(this, err);}
        }
        );
      }
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
    this.reload(this.originalTemplate);
  }

  onSave() {
    this.template = this.saveLocally();

    if (this.isAdd()) {
      this.templatesService.create(this.template).subscribe({next: (template) => {
        this.template = template;
        this.rememberOriginalTemplate(template);
        this.readonly = true;
        this.reload(template);
        },
      error: (err) => {handleError(this, err);} });
    } else {
      this.templatesService.update(this.template).subscribe({next: (template) => {
        this.template = template;
        this.rememberOriginalTemplate(template);
        this.readonly = true;
        this.reload(template);
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
    this.router.navigate(['/templates']);
  }

  isAdd(): boolean {
    return this.template?.id === undefined;
  }

  setFormValues(template: Template|undefined): void {
    this.nameFC.setValue(template?.name ?? '');
  }

  reload(template: Template | undefined): void {
    this.setFormValues(template);
    this.modified = false;
  }

  onChange() {
    this.modified = true;
  }

  onReload() {
    const templateId = this.template?.id;
    this.templatesService.findById(Number(templateId))
    .subscribe(
      {next: (template) => {
        this.template = template;
        this.rememberOriginalTemplate(template);
        this.reload(template);
      },
      error: (err) => {handleError(this, err);}
    });
  }

  saveLocally(): Template {
    if (this.template === undefined) {
      this.template = { name: '' };
    }
    this.template.name = this.nameFC.value ?? '';
    return this.template;
  }

  private rememberOriginalTemplate(template: Template) {
     this.originalTemplate = {id: template.id, name: template.name};
     if (template.properties !== undefined) {
       this.originalTemplate.properties = [];
       for (let i = 0; i < template.properties.length; i++) {
         let originalProperty = {
           id: template.properties[i].id,
           name: template.properties[i].name,
           type: template.properties[i].type
         }
         this.originalTemplate.properties.push(originalProperty);
       }
     }
  }

  showAlert(message: string): void {
    this.alertMessage = message;
  }

  clearAlert() {
    this.alertMessage = '';
  }

  addOrRemoveProperties(): void {
    this.saveLocally();
    const templateId = this.template?.id ?? 'new';
    this.router.navigate(['/templates', templateId, 'properties'], {state: this.collectTemplateState()});
  }

  collectTemplateState() {
    return {template: this.template,
      originalTemplate: this.originalTemplate,
      modified: this.modified,
      readonly: this.readonly
      };
  }

  removeProperty(propertyId: number|undefined): void {
    if (propertyId !== undefined && this.template?.properties !== undefined) {
      const index = this.template.properties.findIndex(templateProp => propertyId === templateProp.id);
      if (index >= 0) {
        this.template.properties.splice(index, 1);
        this.modified = true;
      }
    }
  }

  movePropertyUp(index: number): void {
    this.moveProperty(index, index-1);
    this.modified = true;
  }

  movePropertyDown(index: number): void {
    this.moveProperty(index, index+1);
    this.modified = true;
  }

  private moveProperty(from: number, to: number): void {
    if (this.template?.properties) {
      // remove `from` item and store it
      var property = this.template.properties.splice(from, 1)[0];
      // insert stored item into position `to`
      this.template.properties.splice(to, 0, property);
    }
  }

}
