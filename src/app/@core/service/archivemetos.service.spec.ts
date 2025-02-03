import { TestBed } from '@angular/core/testing';

import { ArchivemetosService } from './archivemetos.service';

describe('ArchivemetosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivemetosService = TestBed.get(ArchivemetosService);
    expect(service).toBeTruthy();
  });
});
