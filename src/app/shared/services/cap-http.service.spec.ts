import { TestBed } from '@angular/core/testing';

import { CapHttpService } from './cap-http.service';

describe('CapHttpService', () => {
  let service: CapHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
