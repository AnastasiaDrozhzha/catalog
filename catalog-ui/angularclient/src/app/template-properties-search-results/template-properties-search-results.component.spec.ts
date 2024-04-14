import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePropertiesSearchResultsComponent } from './template-properties-search-results.component';

describe('TemplatePropertiesSearchResultsComponent', () => {
  let component: TemplatePropertiesSearchResultsComponent;
  let fixture: ComponentFixture<TemplatePropertiesSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatePropertiesSearchResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatePropertiesSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
