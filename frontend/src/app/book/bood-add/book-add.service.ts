import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AddBookGQL, AddBookMutation} from '../../../graphql/generated';

@Injectable({
  providedIn: 'root'
})
export class BookAddService {

  constructor(private http: HttpClient, private createBookGQL: AddBookGQL) {
  }

  getBookDetails(isbn: string): Observable<BookDetails> {
    console.log(isbn);
    const apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
    console.log(apiUrl);
    return this.http.get<BookData>(apiUrl).pipe(
      map(response => {
        const details = response[Object.keys(response)[0]].details;
        console.log(details);
        return {
          title: details.title,
          author: details.authors?.map(author => author.name).join(', ') || 'Unknown',
          isbn: isbn,
          description: details.notes || details.subtitle || 'No Description available'
        };
      })
    );
  }

  addBook(bookDetails: BookDetails) {
    return this.createBookGQL.mutate(bookDetails).pipe(map(result =>
    {
      if(result.data) {
        return result.data.addBook as AddBookMutation
      }
      return null;
    }));
  }
}

export interface BookDetails {
  title: string;
  author: string;
  isbn: string;
  description: string;
}


export interface BookData {
  [isbn: string]: BookApiResponse;
}

export interface BookApiResponse {
  bib_key: string;
  info_url: string;
  preview: string;
  preview_url: string;
  thumbnail_url?: string;
  details: BookDetails;
}

export interface BookDetails {
  notes?: string;
  identifiers?: Identifiers;
  title: string;
  subtitle?: string;
  authors?: Author[];
  publish_date?: string;
  publishers?: string[];
  ia_box_id?: string[];
  series?: string[];
  pagination?: string;
  covers?: number[];
  local_id?: string[];
  publish_places?: string[];
  subjects?: string[];
  uri_descriptions?: string[];
  edition_name?: string;
  genres?: string[];
  source_records?: string[];
  languages?: Language[];
  url?: string[];
  publish_country?: string;
  by_statement?: string;
  type?: Type;
  uris?: string[];
  key?: string;
  number_of_pages?: number;
  works?: Work[];
  classifications?: Classifications;
  ocaid?: string;
  isbn_10?: string[];
  lccn?: string[];
  dewey_decimal_class?: string[];
  lc_classifications?: string[];
  latest_revision?: number;
  revision?: number;
  created?: Timestamp;
  last_modified?: Timestamp;
}

export interface Identifiers {
  goodreads?: string[];
  librarything?: string[];
  isbn_10?: string[];
  lccn?: string[];
  openlibrary?: string[];
}

export interface Author {
  key: string;
  name: string;
}

export interface Language {
  key: string;
}

export interface Type {
  key: string;
}

export interface Work {
  key: string;
}

export interface Classifications {
  lc_classifications?: string[];
  dewey_decimal_class?: string[];
}

export interface Timestamp {
  type: string;
  value: string;
}
