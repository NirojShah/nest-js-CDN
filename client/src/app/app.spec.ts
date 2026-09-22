import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should include the home and login routes needed for navigation', () => {
    expect(routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '' }),
        expect.objectContaining({ path: 'login' }),
      ]),
    );
  });
});
