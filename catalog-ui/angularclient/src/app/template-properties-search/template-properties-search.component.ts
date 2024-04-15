import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Template } from '../model/template';
import { TemplateState } from '../model/template-state';
import { Property } from '../model/property';
import { PropertyType } from '../model/property-type';
import { AlertComponent } from '../alert/alert.component';
import { TemplatePropertiesSearchResultsComponent } from '../template-properties-search-results/template-properties-search-results.component'

@Component({
  selector: 'app-template-properties-search',
  standalone: true,
  imports: [AlertComponent,TemplatePropertiesSearchResultsComponent],
  templateUrl: './template-properties-search.component.html',
  styleUrl: './template-properties-search.component.css'
})
export class TemplatePropertiesSearchComponent {

  location: Location = inject(Location);
  router: Router = inject(Router);
  templateState: TemplateState | undefined;

  fakeSearchProperties: Property[] = [{id: 1, name: 'Prop1', type: PropertyType[PropertyType.string]},
    {id: 2, name: 'Prop2', type: PropertyType[PropertyType.number]},
    {id: 3, name: 'Prop3', type: PropertyType[PropertyType.boolean]},
    {id: 4, name: 'Prop4', type: PropertyType[PropertyType.string]},
      {id: 5, name: 'Prop5', type: PropertyType[PropertyType.number]},
      {id: 6, name: 'Prop6', type: PropertyType[PropertyType.boolean]}];

  constructor() {
    const state = window.history.state;
    if (state?.template !== undefined) {
      this.templateState = state;
    }
  }

  onBack() {
    const templateId = this.templateState?.template?.id ?? 'new';
    this.router.navigate(['/templates', templateId], {state: this.templateState});
  }
}
