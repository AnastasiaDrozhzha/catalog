import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Property } from '../model/property';
import { PageConfig } from '../model/page-config';
import { PropertiesService } from '../service/properties.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-properties-search-results',
  standalone: true,
  imports: [NgFor, RouterLink, PaginationComponent],
  templateUrl: './properties-search-results.component.html',
  styleUrl: './properties-search-results.component.css'
})
export class PropertiesSearchResultsComponent {

  propertiesService: PropertiesService = inject(PropertiesService);
  @Output() deleteEvent = new EventEmitter<string>();
  @Output() pageChangeEvent = new EventEmitter<number>();
  @Input() results!: Property[];
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;

  delete(propertyId: number | undefined) {
    if (propertyId !== undefined) {
       this.propertiesService.delete(propertyId).subscribe({next: () => {this.deleteEvent.emit('');},
       error: (err) => {this.deleteEvent.emit("Error deleting template")}});
    }
  }

  onPageChange(event: number) {
    this.pageChangeEvent.emit(event);
  }
}
