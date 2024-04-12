import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesSearchComponent } from './templates-search.component';

describe('TemplatesSearchComponent', () => {
  let component: TemplatesSearchComponent;
  let fixture: ComponentFixture<TemplatesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
