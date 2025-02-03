import { TestBed } from '@angular/core/testing';

import { InstallationService } from './installation.service';

describe('InstallationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstallationService = TestBed.get(InstallationService);
    expect(service).toBeTruthy();
  });
});
