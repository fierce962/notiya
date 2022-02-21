import { TestBed } from '@angular/core/testing';

import { ControlHistoryRoutService } from './control-history-rout.service';

describe('ControlHistoryRoutService', () => {
  let service: ControlHistoryRoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlHistoryRoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
