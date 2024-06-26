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
  nameFC = new FormControl('')
  alertMessage: string = '';
  modified = false;
  indexToReorder: number|undefined;

  constructor() {
    const state = window.history.state;
    if (state !== null && state.template !== undefined) {
      this.template = state.template;
      this.setFormValues(this.template);
      this.originalTemplate = state.originalTemplate;
      this.modified = state.modified;
    } else {
      const templateId = this.route.snapshot.params['templateId'];
      if (!isNaN(Number(templateId))) {
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

  onCancel() {
    this.modified = false;
    if (this.originalTemplate !== undefined) {
      const clone = this.cloneTemplate(this.originalTemplate);
      this.template = clone;
    } else {
      this.template = undefined;
    }
    this.reload(this.template);
  }

  onSave() {
    this.template = this.saveLocally();

    if (this.isAdd()) {
      this.templatesService.create(this.template).subscribe({next: (template) => {
        this.template = template;
        this.rememberOriginalTemplate(template);
        this.reload(template);
        },
      error: (err) => {handleError(this, err);} });
    } else {
      this.templatesService.update(this.template).subscribe({next: (template) => {
        this.template = template;
        this.rememberOriginalTemplate(template);
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

  private cloneTemplate(template: Template) : Template {
    const clone: Template = {id: template.id, name: template.name};
       if (template.properties !== undefined) {
         clone.properties = [];
         for (let i = 0; i < template.properties.length; i++) {
           let originalProperty = {
             id: template.properties[i].id,
             name: template.properties[i].name,
             type: template.properties[i].type
           }
           clone.properties.push(originalProperty);
         }
       }
       return clone;
    }


  private rememberOriginalTemplate(template: Template): void {
     this.originalTemplate = this.cloneTemplate(template);
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
      modified: this.modified
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

  toggleReordering(index: number): void {
    if (this.indexToReorder === undefined) {
      this.indexToReorder = index;
    } else {
      this.indexToReorder = undefined;
    }
  }

  isIndexToReorder(index: number): boolean {
    return this.indexToReorder === index;
  }

  doReorder(event: Event): void {
    const targetIndex = (<HTMLSelectElement>event.target).value;
    if (this.indexToReorder !== undefined && !isNaN(Number(targetIndex))) {
      this.moveProperty(this.indexToReorder, Number(targetIndex));
      this.modified = true;
    }
    this.indexToReorder = undefined;
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
