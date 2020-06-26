import { TestBed, inject } from '@angular/core/testing';

import { CheckStreamerService } from './check-streamer.service';

describe('CheckStreamerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckStreamerService]
    });
  });

  it('should be created', inject([CheckStreamerService], (service: CheckStreamerService) => {
    expect(service).toBeTruthy();
  }));
});
