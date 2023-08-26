import { TestBed } from '@angular/core/testing';

import { ReceipientsService } from './receipients.service';

describe('ReceipientsService', () => {
  let service: ReceipientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceipientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
