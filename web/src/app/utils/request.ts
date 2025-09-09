import {Injectable, inject} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { REQUEST_METHODS } from "../common/request_methods";
import { RequestResponse } from "../interfaces/request";
import { ActiveUser } from "../stores/active_user";

export const redirectIfNotAuthenticated = (res: any, activeUser: ActiveUser) => {
  if (res.status === 401) {
    activeUser.clearUserData();
    return window.location.replace("/auth/login");
  }
  if (res.status === 403) return window.location.replace("/");
};

export const encodeQuery = (query: Record<string, any>) => {
  const searchParams = new URLSearchParams(query || {});
  return searchParams.toString();
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private activeUser = inject(ActiveUser);

  async request<T>({
               url,
               query,
               method = REQUEST_METHODS.GET,
               body,
               formData,
               headers = {},
               skipRedirect = false,
             }: {
    url: string;
    query?: Record<string, any>;
    method?: string;
    body?: any;
    formData?: FormData;
    headers?: Record<string, string>;
    skipRedirect?: boolean;
  }): Promise<RequestResponse<T>> {
    if (!this.activeUser) {
      this.activeUser = inject(ActiveUser);
    }

    const jsonMethods = Object.values(REQUEST_METHODS);
    if (!jsonMethods.includes(method)) {
      throw Error(`Unsupported method "${method}"`);
    }
    if (query) {
      url += `?${encodeQuery(query)}`;
    }

    const options: {
      headers: HttpHeaders;
      withCredentials: boolean;
      observe: 'response';
    } = {
      headers: new HttpHeaders(headers),
      withCredentials: false,
      observe: 'response'
    };

    options.headers = options.headers.set('Content-Type', 'application/json');
    const token = this.activeUser.getToken();
    if (token) {
      options.headers = options.headers.set('Authorization', `Bearer ${token}`);
    }

    let observable;

    switch (method) {
      case 'POST':
        observable = this.http.post<T>(url, formData || body, options);
        break;
      case 'PUT':
        observable = this.http.put<T>(url, formData || body, options);
        break;
      case 'DELETE':
        observable = this.http.delete<T>(url, options);
        break;
      default:
        observable = this.http.get<T>(url, options);
    }

    try {
      const res = await firstValueFrom(observable);

      return {
        res,
        data: res.body as T,
        headers: res.headers
      };

    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        if (!skipRedirect) {
          redirectIfNotAuthenticated(e, this.activeUser);
        }
      } else {
        console.error(e);
      }
      throw e;
    }
  }
}
