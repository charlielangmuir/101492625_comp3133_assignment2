import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = null;
  loading = true;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empService: EmployeeService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.empService.getById(this.id).valueChanges.subscribe({
      next: (res: any) => {
        this.employee = res.data.searchEmployeeByEid;
        this.loading = false;
        if (!this.employee) this.router.navigate(['/employees']);
      },
      error: () => {
        this.snack.open('Employee not found', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      }
    });
  }

  edit() {
    this.router.navigate(['/employees', this.id, 'edit']);
  }

  delete() {
    if (!confirm(`Delete ${this.employee?.first_name} ${this.employee?.last_name}? This cannot be undone.`)) return;
    this.empService.delete(this.id).subscribe({
      next: () => {
        this.snack.open('Employee deleted', '', { duration: 2500 });
        this.router.navigate(['/employees']);
      },
      error: (err: any) => this.snack.open(err.message || 'Delete failed', 'Close', { duration: 3000 })
    });
  }

  back() {
    this.router.navigate(['/employees']);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  getInitials(): string {
    if (!this.employee) return '?';
    return `${this.employee.first_name?.[0] ?? ''}${this.employee.last_name?.[0] ?? ''}`.toUpperCase();
  }
}
