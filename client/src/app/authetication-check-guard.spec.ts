import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { autheticationCheckGuard } from './authetication-check-guard';

describe('autheticationCheckGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => autheticationCheckGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
