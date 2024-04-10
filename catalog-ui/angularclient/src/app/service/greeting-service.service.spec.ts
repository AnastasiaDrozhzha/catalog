import { TestBed } from '@angular/core/testing';

import { GreetingServiceService } from './greeting-service.service';

describe('GreetingServiceService', () => {
  let service: GreetingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreetingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
