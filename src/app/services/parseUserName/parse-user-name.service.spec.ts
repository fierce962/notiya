import { TestBed } from '@angular/core/testing';

import { ParseUserNameService } from './parse-user-name.service';

describe('ParseUserNameService', () => {
  let service: ParseUserNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseUserNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
