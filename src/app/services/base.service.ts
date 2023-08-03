import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError  } from 'rxjs';
import { catchError,map  } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export abstract class BaseService<T> {
  protected apiUrl: string =  environment.apiBaseUrl;
  protected abstract http: HttpClient; // API base URL
  protected data: T[] = [];
  public getData: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  constructor() {}

  // Abstract method for getting the endpoint URL
  protected abstract getEndpoint(): string;


  // Extract data from the API response
  private extractData<T>(response: any): T  {
    if (Array.isArray(response.data)) {
      return response.data as T;
    } else {
      return response.data as T;
    }
  }

  // Error handling function
  private handleError(error: any): Observable<never> {
    let errorMessage = `Something went wrong. Please try again later.`;
    console.error('An error occurred:', error);

    if(error instanceof  HttpErrorResponse){

      return throwError(() => error.error);
    }

    return throwError(() => new Error(errorMessage));
  }

  // Get all items
  getAll(url?: string): Observable<T[]> {
    const endpoint = url ? url : this.getEndpoint();
    const fullUrl = `${this.apiUrl}/${endpoint}`;
    return this.http.get<T[]>(fullUrl).pipe(
      map(response => this.extractData<T[]>(response)),
      catchError(this.handleError)
    );
  }

  // Get single item by ID
  getById(id: number, url?: string): Observable<T> {
    const endpoint = url ? url : this.getEndpoint();
    const fullUrl = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.get<T>(fullUrl).pipe(
      map(response => this.extractData<T>(response)),
      catchError(this.handleError)
    );
  }

  // Create a new item
  create(item: T, url?: string): Observable<T> {
    const endpoint = url ? url : this.getEndpoint();
    const fullUrl = `${this.apiUrl}/${endpoint}`;
    return this.http.post<T>(fullUrl, item).pipe(
      map(response => this.extractData<T>(response)),
      catchError(this.handleError)
    );
  }

  // Update an existing item
  update( id: number,item: T, url?: string): Observable<T> {
    const endpoint = url ? url : this.getEndpoint();
    const fullUrl = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.put<T>(fullUrl, item).pipe(
      map(response => this.extractData<T>(response)),
      catchError(this.handleError)
    );
  }

  // Delete an item by ID
  delete(id: number, url?: string): Observable<void> {
    const endpoint = url ? url : this.getEndpoint();
    const fullUrl = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.delete<void>(fullUrl).pipe(catchError(this.handleError));
  }

  // Normal GET request
  get<T>(url: string): Observable<T> {
    return this.customCall('get', url)

  }

  // Normal POST request
  post<T>(url: string, body: any): Observable<T>  {
    return this.customCall('post', url, body)
  }

  // Normal PUT request
  put<T>(url: string, body: any): Observable<T> {
    return this.customCall('put', url, body)
  }

  // Custom API call
  customCall<T>(method: string, url: string, body?: any): Observable<T> {
    const fullUrl = `${this.apiUrl}/${url}`;
    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get<T>(fullUrl).pipe(
          map(response => this.extractData<T>(response)),
          catchError(this.handleError)
        );
      case 'post':
        return this.http.post<T>(fullUrl, body).pipe(
          map(response => this.extractData<T>(response)),
          catchError(this.handleError)
        );
      case 'put':
        return this.http.put<T>(fullUrl, body).pipe(
          map(response => this.extractData<T>(response)),
          catchError(this.handleError)
        );
      case 'delete':
        return this.http.delete<T>(fullUrl).pipe(catchError(this.handleError));
      default:
        throw new Error(`Invalid HTTP method: ${method}`);
    }
  }

  // Perform a file upload with multiple files or fields
  uploadFile<T>(
    url: string,
    files: File[],
    fields?: { [key: string]: any },
    fileNames?: string[] ,
  ): Observable<T> {
    const fullUrl = `${this.apiUrl}/${url}`;

    const formData: FormData = new FormData();

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const fileName = fileNames && fileNames[i] ? fileNames[i] : `file${i + 1}`;
        formData.append(fileName, files[i]);
      }
    }

    if (fields) {
      Object.keys(fields).forEach(key => {
        formData.append(key, fields[key]);
      });
    }

    return this.http.post<T>(fullUrl, formData).pipe(
      map(response => this.extractData<T>(response)),
      catchError(this.handleError)
    );
  }

  deleteLocally(item: T) {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
      this.getData.next(this.data);
    }
  }

  // Update an existing item locally
  updateLocally(item: T, getId: (item: T) => any) {
    const id = getId(item);
    const index = this.data.findIndex(dataItem => getId(dataItem) === id);
    if (index > -1) {
      this.data[index] = item;
      this.getData.next(this.data);
    }
  }
}
