import { TestBed } from '@angular/core/testing';

import { IoImpulseService } from './io-impulse.service';

describe('IoImpulseService', () => {
  let service: IoImpulseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IoImpulseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
