import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { Subject } from 'rxjs';

import { Template } from '../model/template';
import { TemplateState } from '../model/template-state';
import { Property } from '../model/property';
import { PropertyType } from '../model/property-type';
import { handleError } from '../model/errorUtil';

import { PropertiesService } from '../service/properties.service';

import { AlertComponent } from '../alert/alert.component';
import { PropertiesSearchResultsComponent } from '../properties-search-results/properties-search-results.component';

@Component({
  selector: 'app-properties-search',
  standalone: true,
  imports: [AlertComponent, PropertiesSearchResultsComponent, RouterLink],
  templateUrl: './properties-search.component.html',
  styleUrl: './properties-search.component.css'
})
export class PropertiesSearchComponent {

  location: Location = inject(Location);
  router: Router = inject(Router);
  propertiesService: PropertiesService = inject(PropertiesService);

  private searchSubject = new Subject<string>();

  private readonly debounceTimeMs = 300; // TODO: move to one place
  private lastSearch = '';
  results: Property[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  alertMessage: string = '';

  constructor() {
    this.performSearch('', this.getOffset(), this.itemsPerPage);
  }

  ngOnInit() {
      this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
        this.performSearch(searchValue, 0, this.itemsPerPage);
      });
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

  onDelete(failure: string) {
    if (failure) {
      this.showAlert(failure);
    } else {
      this.performSearch(this.lastSearch, this.getOffset(), this.itemsPerPage);
    }
  }

  onPageChange(event: number) {
    this.currentPage = event;
    this.performSearch(this.lastSearch, this.getOffset(), this.itemsPerPage);
  }

 onSearch(event: Event) {
   this.searchSubject.next((event.target as HTMLInputElement).value);
 }

}
