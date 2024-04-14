import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesSearchResultsComponent } from './properties-search-results.component';

describe('PropertiesSearchResultsComponent', () => {
  let component: PropertiesSearchResultsComponent;
  let fixture: ComponentFixture<PropertiesSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesSearchResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertiesSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
