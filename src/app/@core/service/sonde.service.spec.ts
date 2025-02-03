import { TestBed } from '@angular/core/testing';

import { SondeService } from './sonde.service';

describe('SondeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SondeService = TestBed.get(SondeService);
    expect(service).toBeTruthy();
  });
});
