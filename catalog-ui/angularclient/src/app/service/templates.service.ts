import { Injectable } from '@angular/core';
import { Template } from '../model/template';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  templates: Template[] = [{id: 1, name: "Template 1"}, {id: 2, name: "Template 2"}, {id: 3, name: "Template 3"}]

  constructor() { }

  findAll(): Template[] {
    return this.templates;
  }

  findById(id: number): Template | undefined {
    return this.templates.find(template => template.id === id);
  }

  create(template: Template): Template {
    console.log("Added template: " + JSON.stringify(template));
    template.id = 55;
    return template;
  }

  update(template: Template): Template {
    console.log("Updated template: " + JSON.stringify(template));
    return template;
  }

  delete(templateId: number) {
    console.log("Delete template with id: " + templateId);
  }
}
