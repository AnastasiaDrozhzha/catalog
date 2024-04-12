import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesSearchResultsComponent } from './templates-search-results.component';

describe('TemplatesSearchResultsComponent', () => {
  let component: TemplatesSearchResultsComponent;
  let fixture: ComponentFixture<TemplatesSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesSearchResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
