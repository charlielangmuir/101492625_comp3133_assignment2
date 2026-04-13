import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent {
  form: FormGroup;

  loading = false;
  photoPreview: string | null = null;
  photoName: string | null = null;

  genders     = ['Male', 'Female', 'Other'];
  departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];

  constructor(
    private fb: FormBuilder,
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
      salary: [null, [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required],
      employee_photo: ['']
    });
  }

  get f() { return this.form.controls; }

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
    this.empService.add(this.form.value).subscribe({
      next: () => {
        this.snack.open('Employee added successfully!', '', { duration: 2500 });
        this.router.navigate(['/employees']);
      },
      error: (err: any) => {
        this.snack.open(err.message || 'Failed to add employee', 'Close', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
