import { Routes } from '@angular/router';
import { GreetingComponent } from './greeting/greeting.component';
import { TemplatesSearchComponent } from './templates-search/templates-search.component';
import { TemplateDetailsComponent } from './template-details/template-details.component';

export const routes: Routes = [
  { path: 'greeting', component: GreetingComponent },
  { path: 'templates', component: TemplatesSearchComponent, title: 'Templates' },
  { path: 'templates/:templateId', component: TemplateDetailsComponent, title: 'Template details' },
  { path: 'templates/new', component: TemplateDetailsComponent, title: 'Add template' },
  ];
