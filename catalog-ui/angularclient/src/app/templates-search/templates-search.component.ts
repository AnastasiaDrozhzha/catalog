import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Template } from '../model/template';
import { TemplatesService } from '../service/templates.service';
import { TemplatesSearchResultsComponent } from '../templates-search-results/templates-search-results.component'

@Component({
  selector: 'app-templates-search',
  standalone: true,
  imports: [TemplatesSearchResultsComponent, RouterLink],
  templateUrl: './templates-search.component.html',
  styleUrl: './templates-search.component.css'
})
export class TemplatesSearchComponent implements OnInit, OnDestroy {
  results: Template[] = [];
  templatesService: TemplatesService = inject(TemplatesService);
  private searchSubject = new Subject<string>();
  lastSearch = '';

  private readonly debounceTimeMs = 300;

  constructor() {
    this.results = this.templatesService.findAll();
  }

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearch(event: Event) {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  onDelete(event: number) {
    this.performSearch(this.lastSearch);
  }

  performSearch(searchValue: string) {
    this.lastSearch = searchValue;
    console.log('Performing search for:', searchValue);
  }
}
