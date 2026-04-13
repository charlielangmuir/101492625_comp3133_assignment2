import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchFilter' })
export class SearchPipe implements PipeTransform {
  transform(employees: any[], searchBy: string, value: string): any[] {
    if (!searchBy || !value) return employees;
    return employees.filter(e =>
      e[searchBy]?.toLowerCase().includes(value.toLowerCase())
    );
  }
}