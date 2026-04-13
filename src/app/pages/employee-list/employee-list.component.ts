import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  displayedColumns = ['photo','name','email','department','designation','salary','actions'];
  searchBy = '';
  searchValue = '';
  loading = false;

  constructor(
    private empService: EmployeeService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.loading = true;
    this.empService.getAll().valueChanges.subscribe({
      next: (res: any) => { this.employees = res.data.getAllEmployees; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  search() {
    if (!this.searchBy || !this.searchValue) { this.loadEmployees(); return; }
    this.empService.search(this.searchBy, this.searchValue).valueChanges.subscribe({
      next: (res: any) => {
        this.employees = res.data.searchEmployeeByDesignationOrDepartment;
      }
    });
  }

  delete(id: string) {
    if (!confirm('Delete this employee?')) return;
    this.empService.delete(id).subscribe({
      next: () => this.snack.open('Employee deleted', 'OK', { duration: 2000 }),
      error: (e: any) => this.snack.open(e.message, 'Close', { duration: 3000 })
    });
  }

  logout() { this.auth.logout(); }
}