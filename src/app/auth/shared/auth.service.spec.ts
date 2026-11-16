import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNgxWebstorage, withLocalStorage } from 'ngx-webstorage';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNgxWebstorage(withLocalStorage())]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('stores the authentication token and username on login', () => {
    let loggedIn = false;
    service.login({ username: 'test-user', password: 'password' }).subscribe(result => loggedIn = result);
    const request = http.expectOne(`${environment.apiBaseUrl}/auth/login`);
    request.flush({ authenticationToken: 'test-token', username: 'test-user', refreshToken: 'refresh', expiresAt: 'tomorrow' });
    expect(loggedIn).toBeTrue();
    expect(service.getJwtToken()).toBe('test-token');
    expect(localStorage.getItem('ngx-webstorage|authenticationtoken')).toBe('"test-token"');
    expect(service.getUserName()).toBe('test-user');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('uses the configured API for signup, refresh and logout', () => {
    service.signup({ username: 'test-user', password: 'password', email: 'test@example.com' }).subscribe();
    const signup = http.expectOne(`${environment.apiBaseUrl}/auth/signup`);
    expect(signup.request.method).toBe('POST');
    signup.flush('ok');
    service.refreshToken().subscribe();
    const refresh = http.expectOne(`${environment.apiBaseUrl}/auth/refresh/token`);
    expect(refresh.request.method).toBe('POST');
    refresh.flush({ authenticationToken: 'test-token', expiresAt: 'tomorrow' });
    service.logout();
    http.expectOne(`${environment.apiBaseUrl}/auth/logout`).flush('ok');
  });
});
