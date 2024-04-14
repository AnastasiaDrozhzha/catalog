import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesSearchComponent } from './properties-search.component';

describe('PropertiesSearchComponent', () => {
  let component: PropertiesSearchComponent;
  let fixture: ComponentFixture<PropertiesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertiesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
