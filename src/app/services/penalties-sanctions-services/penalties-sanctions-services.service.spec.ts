/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PenaltiesSanctionsServicesService } from './penalties-sanctions-services.service';

describe('Service: PenaltiesSanctionsServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PenaltiesSanctionsServicesService]
    });
  });

  it('should ...', inject([PenaltiesSanctionsServicesService], (service: PenaltiesSanctionsServicesService) => {
    expect(service).toBeTruthy();
  }));
});
