import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Template } from '../model/template';
import { TemplatesService } from '../service/templates.service';


@Component({
  selector: 'app-templates-search-results',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './templates-search-results.component.html',
  styleUrl: './templates-search-results.component.css'
})
export class TemplatesSearchResultsComponent {

  templatesService: TemplatesService = inject(TemplatesService);
  @Output() deleteEvent = new EventEmitter<number>();

  @Input() results!: Template[];

  delete(templateId: number | undefined) {
    if (templateId !== undefined) {
       this.templatesService.delete(templateId);
       this.deleteEvent.emit(templateId);
    }
  }
}
