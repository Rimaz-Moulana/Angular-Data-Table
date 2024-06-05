import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  comments: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  searchText: string = '';
  isLoading: boolean = false;
  sortKey: string = '';
  sortDirection: number = 1;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/comments')
      .subscribe(data => {
        this.comments = data;
        this.isLoading = false;
      });
  }

  getPaginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.comments.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
  }

  onSort(key: string): void {
    // If the same key is clicked again, toggle sort direction
    if (this.sortKey === key) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortDirection = 1;
    }
    this.sortKey = key;

    this.comments.sort((a, b) => {
      if (a[key] < b[key]) return -1 * this.sortDirection;
      if (a[key] > b[key]) return 1 * this.sortDirection;
      return 0;
    });
  }

  onSearch(): void {
    if (!this.searchText) {
      this.loadData();
      return;
    }
    this.isLoading = true;
    this.http.get<any[]>(`https://jsonplaceholder.typicode.com/comments?q=${this.searchText}`)
      .subscribe(data => {
        this.comments = data;
        this.isLoading = false;
      });
  }
}
