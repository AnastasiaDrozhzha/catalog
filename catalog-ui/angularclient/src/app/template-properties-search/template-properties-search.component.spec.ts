import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePropertiesSearchComponent } from './template-properties-search.component';

describe('TemplatePropertiesSearchComponent', () => {
  let component: TemplatePropertiesSearchComponent;
  let fixture: ComponentFixture<TemplatePropertiesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatePropertiesSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatePropertiesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
