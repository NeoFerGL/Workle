import { TestBed } from '@angular/core/testing';

import { VideollamadasService } from './videollamadas.service';

describe('VideollamadasService', () => {
  let service: VideollamadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideollamadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
