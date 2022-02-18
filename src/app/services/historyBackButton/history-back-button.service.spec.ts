import { TestBed } from '@angular/core/testing';

import { HistoryBackButtonService } from './history-back-button.service';

describe('HistoryBackButtonService', () => {
  let service: HistoryBackButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryBackButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
