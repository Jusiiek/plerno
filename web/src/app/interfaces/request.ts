import {
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';

export interface RequestResponse<T = any> {
  res: HttpResponse<T>;
  data: T;
  headers: HttpHeaders;
}
