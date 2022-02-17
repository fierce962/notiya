import { TestBed } from '@angular/core/testing';

import { NotificationThumbnailService } from './notification-thumbnail.service';

describe('NotificationThumbnailService', () => {
  let service: NotificationThumbnailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationThumbnailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
