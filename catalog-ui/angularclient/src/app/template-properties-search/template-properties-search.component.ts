import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Template } from '../model/template';
import { TemplateState } from '../model/template-state';
import { Property } from '../model/property';
import { PropertyType } from '../model/property-type';
import { handleError } from '../model/errorUtil';

import { PropertiesService } from '../service/properties.service';

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

  propertiesService: PropertiesService = inject(PropertiesService);

  private searchSubject = new Subject<string>();

  private readonly debounceTimeMs = 300; // TODO: move to one place
  private lastSearch = '';
  results: Property[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  alertMessage: string = '';

  constructor() {
    const state = window.history.state;
    if (state?.template !== undefined) {
      this.templateState = state;
    }
    this.performSearch('', this.getOffset(), this.itemsPerPage);
  }

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
      this.performSearch(searchValue, 0, this.itemsPerPage);
    });
  }

  onBack() {
    const templateId = this.templateState?.template?.id ?? 'new';
    this.router.navigate(['/templates', templateId], {state: this.templateState});
  }

  onPageChange(event: number) {
    this.currentPage = event;
    this.performSearch(this.lastSearch, this.getOffset(), this.itemsPerPage);
  }

  getOffset(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  showAlert(message: string): void {
    this.alertMessage = message;
  }

  clearAlert() {
    this.alertMessage = '';
  }

  performSearch(searchValue: string, offset: number, pageSize: number) {
    const searchStrChanged = this.lastSearch !== searchValue;
    if (searchStrChanged) {
      this.currentPage = 1;
    }
    this.propertiesService.searchPage(searchValue, this.getOffset(), this.itemsPerPage)
      .subscribe({
        next: (page) => { this.results = page.results;
                  this.totalItems = page.totalCount;},
        error: (err) => {handleError(this, err)}
                  });
    this.lastSearch = searchValue;
  }

  onSearch(event: Event): void {
   this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  onAdd(property: Property): void {
    const template = this.templateState?.template
    if (this.templateState !== undefined && template !== undefined) {
      if (template.properties === undefined) {
        template.properties = [];
      }
      template.properties.push(property);
      this.templateState.modified = true;
    }
  }

  onRemove(property: Property): void {
    const templateProperties = this.templateState?.template?.properties;
    if (this.templateState !== undefined && templateProperties !== undefined) {
      const index = templateProperties.findIndex(templateProp => property.id === templateProp.id);
      if (index >= 0) {
        templateProperties.splice(index, 1);
        this.templateState.modified = true;
      }
    }
  }
}
