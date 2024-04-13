import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Template } from '../model/template';
import { Alertable } from '../model/alertable';
import { handleError } from '../model/errorUtil';
import { TemplatesService } from '../service/templates.service';
import { TemplatesSearchResultsComponent } from '../templates-search-results/templates-search-results.component'
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-templates-search',
  standalone: true,
  imports: [TemplatesSearchResultsComponent, RouterLink, NgIf, AlertComponent],
  templateUrl: './templates-search.component.html',
  styleUrl: './templates-search.component.css'
})
export class TemplatesSearchComponent implements OnInit, OnDestroy, Alertable {
  results: Template[] = [];
  templatesService: TemplatesService = inject(TemplatesService);
  private searchSubject = new Subject<string>();
  lastSearch = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  alertMessage: string = '';

  private readonly debounceTimeMs = 300;

  constructor() {
    this.performSearch('', this.getOffset(), this.itemsPerPage);
  }

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
      this.performSearch(searchValue, 0, this.itemsPerPage);
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearch(event: Event) {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  onDelete(event: string) {
    if (event) {
      this.showAlert(event);
    } else {
      this.performSearch(this.lastSearch, this.getOffset(), this.itemsPerPage);
    }
  }

  onPageChange(event: number) {
    this.currentPage = event;
    this.performSearch(this.lastSearch, this.getOffset(), this.itemsPerPage);
  }

  performSearch(searchValue: string, offset: number, pageSize: number) {
    const searchStrChanged = this.lastSearch !== searchValue;
    if (searchStrChanged) {
      this.currentPage = 1;
    }
    this.templatesService.searchPage(searchValue, this.getOffset(), this.itemsPerPage)
      .subscribe({
        next: (page) => { this.results = page.results;
                  this.totalItems = page.totalCount;},
        error: (err) => {handleError(this, err)}
                  });
    this.lastSearch = searchValue;
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
}
