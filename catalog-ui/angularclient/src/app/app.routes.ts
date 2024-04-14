import { Routes } from '@angular/router';
import { GreetingComponent } from './greeting/greeting.component';
import { TemplatesSearchComponent } from './templates-search/templates-search.component';
import { TemplateDetailsComponent } from './template-details/template-details.component';
import { PropertiesSearchComponent } from './properties-search/properties-search.component';
import { TemplatePropertiesSearchComponent } from './template-properties-search/template-properties-search.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';

export const routes: Routes = [
  { path: 'greeting', component: GreetingComponent },
  { path: 'templates', component: TemplatesSearchComponent, title: 'Templates' },
  { path: 'templates/new', component: TemplateDetailsComponent, title: 'Add template' },
  { path: 'templates/:templateId', component: TemplateDetailsComponent, title: 'Template details' },
  { path: 'templates/:templateId/properties', component: TemplatePropertiesSearchComponent, title: 'Add or remove template properties' },
  { path: 'properties', component: PropertiesSearchComponent, title: 'Properties' },
  { path: 'properties/new', component: PropertyDetailsComponent, title: 'Add property' },
  { path: 'properties/:propertyId', component: PropertyDetailsComponent, title: 'Property details' },
  ];
