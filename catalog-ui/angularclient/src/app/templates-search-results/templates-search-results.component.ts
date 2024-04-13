import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Template } from '../model/template';
import { PageConfig } from '../model/page-config';
import { TemplatesService } from '../service/templates.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-templates-search-results',
  standalone: true,
  imports: [NgFor, RouterLink, PaginationComponent],
  templateUrl: './templates-search-results.component.html',
  styleUrl: './templates-search-results.component.css'
})
export class TemplatesSearchResultsComponent implements PageConfig {

  templatesService: TemplatesService = inject(TemplatesService);
  @Output() deleteEvent = new EventEmitter<number>();
  @Output() pageChangeEvent = new EventEmitter<number>();
  @Input() results!: Template[];
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;

  delete(templateId: number | undefined) {
    if (templateId !== undefined) {
       this.templatesService.delete(templateId).subscribe(() => {this.deleteEvent.emit(templateId);});
    }
  }

  onPageChange(event: number) {
    this.pageChangeEvent.emit(event);
  }
}
