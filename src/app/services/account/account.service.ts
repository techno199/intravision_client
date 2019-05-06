import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiLogin, deviceId, apiLogout, apiIsLoggedIn } from '../api-routes';
import { tap } from 'rxjs/operators';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * Service to authorize ourselves
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) { 
    this.isLoggedIn()
      .subscribe(() => {
        this.isAdmin = true;
        this.isAdminChange.emit(this.isAdmin);
        this.notificationService.showMessage('Вы вошли как администратор')
      }, err => {
        console.log(err);
      })
  }

  /** Determines whether client is authorized */
  isAdmin = false;
  /** Emits each time authorization status changes */
  isAdminChange = new EventEmitter<boolean>();
  /**
   * Perform cookie authentication.
   * You may subscribe to isAdminChange to track the result.
   * @param code password associated with device
   */
  auth(code: string): Observable<any> {
    /** request options */
    const options = {
      params: new HttpParams()
        .set('deviceId', deviceId)
        .set('code', code),
      withCredentials: true
    }

    return this.http.get(apiLogin, options)
      .pipe(
        tap(() => {
          this.isAdmin = true;
          this.isAdminChange.emit(this.isAdmin);
        })
      );
  }
  /** Logs out. Removes auth cookies */
  logout(): Observable<any> {
    return this.http.get(apiLogout, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isAdmin = false;
          this.isAdminChange.emit(this.isAdmin)
        })
      );
  }
  /** This request successfully finishes when client is already authorized.
   * Fails otherwise.
   */
  isLoggedIn(): Observable<any> {
    return this.http.get(apiIsLoggedIn, { withCredentials: true });
  }
}
