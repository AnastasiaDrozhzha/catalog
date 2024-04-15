import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Property } from '../model/property';
import { Template } from '../model/template';
import { PageConfig } from '../model/page-config';
import { PropertiesService } from '../service/properties.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-template-properties-search-results',
  standalone: true,
  imports: [NgFor, PaginationComponent, NgIf],
  templateUrl: './template-properties-search-results.component.html',
  styleUrl: './template-properties-search-results.component.css'
})
export class TemplatePropertiesSearchResultsComponent {

  propertiesService: PropertiesService = inject(PropertiesService);
  @Output() removeEvent = new EventEmitter<Property>();
  @Output() addEvent = new EventEmitter<Property>();
  @Output() pageChangeEvent = new EventEmitter<number>();
  @Input() results!: Property[];
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Input() template: Template | undefined;

  onPageChange(event: number) {
    this.pageChangeEvent.emit(event);
  }

  onAdd(event: Property | undefined): void {
    if (event !== undefined) {
      this.addEvent.emit(event);
    }
  }

  onRemove(event: Property | undefined): void {
    if (event !== undefined) {
      this.removeEvent.emit(event);
    }
  }

  isPresentInTemplate(propertyId: number | undefined): boolean {
    if (this.template?.properties === undefined || propertyId === undefined ) {
      return false;
    }
    return this.template.properties.some(prop => prop.id === propertyId);
  }
}
