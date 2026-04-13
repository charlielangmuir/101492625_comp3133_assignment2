import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  form: FormGroup;

  id!: string;
  loading = false;
  fetching = true;
  photoPreview: string | null = null;
  photoName: string | null = null;

  genders     = ['Male', 'Female', 'Other'];
  departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      salary: [null as number | null, [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required],
      employee_photo: ['']
    });
  }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.empService.getById(this.id).valueChanges.subscribe({
      next: (res: any) => {
        const emp = res.data.searchEmployeeByEid;
        if (!emp) { this.router.navigate(['/employees']); return; }

        // Format date to yyyy-MM-dd for <input type="date">
        const doj = emp.date_of_joining
          ? new Date(emp.date_of_joining).toISOString().split('T')[0]
          : '';

        this.form.patchValue({ ...emp, date_of_joining: doj });

        if (emp.employee_photo) {
          this.photoPreview = emp.employee_photo;
          this.photoName = 'Current photo';
        }
        this.fetching = false;
      },
      error: () => {
        this.snack.open('Failed to load employee', 'Close', { duration: 3000 });
        this.fetching = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.snack.open('Please select an image file', 'Close', { duration: 3000 });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.snack.open('Image must be under 2MB', 'Close', { duration: 3000 });
      return;
    }

    this.photoName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.form.patchValue({ employee_photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview = null;
    this.photoName = null;
    this.form.patchValue({ employee_photo: '' });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.empService.update(this.id, this.form.value).subscribe({
      next: () => {
        this.snack.open('Employee updated!', '', { duration: 2500 });
        this.router.navigate(['/employees', this.id]);
      },
      error: (err: any) => {
        this.snack.open(err.message || 'Update failed', 'Close', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/employees', this.id]);
  }
}
