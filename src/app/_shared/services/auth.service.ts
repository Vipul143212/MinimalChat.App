import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { RegistrationModel } from '../models/RegistrationModel';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  isAuthenticated = false;
  private userName: string | null = null;

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
  }

  /**
 * Registers a user by sending a POST request to the registration API endpoint.
 *
 * @param user - The user registration data (RegistrationModel).
 * @returns An Observable that represents the registration process.
 *          Subscribers can listen for responses and handle them asynchronously.
 */
  registerUser(user: RegistrationModel): Observable<any> {
    const url = `${this.apiUrl}register`;
    return this.http.post(url, user);
  }

  /**
 * Logs in a user by sending a POST request to the login API endpoint.
 *
 * @param user - An object containing the user's email and password.
 * @returns An Observable that represents the login process.
 *          Subscribers can handle the response and perform actions accordingly.
 */
  loginUser(user: { email: string; password: string }): Observable<any> {
    const url = `${this.apiUrl}login`; 
    return this.http.post(url, user).pipe(
      tap((response: any) => {
        if (response && response.data.jwtToken) {
          localStorage.setItem('token', response.data.jwtToken);
          this.isAuthenticated = true;
          this.userName = this.fetchUserNameFromToken(response.data.jwtToken);
        }
      })
    );
  }

  /**
 * Retrieves the user's name.
 *
 * @returns The user's name as a string if available, or null if not available.
 */
  getUserName(): string | null {
    return this.userName;
  }

  /**
 * Checks the authentication status of the user based on the presence of a JWT token.
 * Updates the authentication status and user's name accordingly.
 * This method is typically called during application initialization.
 */
  private checkAuthenticationStatus(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // User is authenticated
      this.isAuthenticated = true;
      this.userName = this.fetchUserNameFromToken(token); 
    } else {
      // User is not authenticated
      this.isAuthenticated = false;
      this.userName = null;
    }
  }

  /**
 * Initiates a Google login by sending a POST request to the Google login API endpoint.
 *
 * @param credentials - A string containing Google login credentials.
 * @returns An Observable that represents the login process.
 *          Subscribers can handle the response and perform actions accordingly.
 */
  LoginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    const url = `${this.apiUrl}googleLogin`;
    return this.http.post(url, JSON.stringify(credentials), { headers: header, withCredentials: true }).pipe(
      tap((response: any) => {
        console.log(response.data);        
        if (response && response.data) {
          localStorage.setItem('token', response.data);
          this.isAuthenticated = true;
          this.userName = this.fetchUserNameFromToken(response.data);
        }
      })
    );
  }

  /**
 * Decodes a JWT token and retrieves the user's username from it.
 *
 * @param token - The JWT token to decode and extract the username from.
 * @returns The username as a string if found in the token, or null if not found or in case of an error.
 */
  private fetchUserNameFromToken(token: string): string | null {
    try {
      // Decode the JWT token
      const decodedToken: any = jwt_decode(token);
  
      const username: string | undefined = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  
      // Return the username if found
      if (username) {
        return username;
      } else {
        // Username not found in the token
        return null;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
