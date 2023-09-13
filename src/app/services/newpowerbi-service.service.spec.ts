import { TestBed } from '@angular/core/testing';

import { NewpowerbiServiceService } from './newpowerbi-service.service';

describe('NewpowerbiServiceService', () => {
  let service: NewpowerbiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewpowerbiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
