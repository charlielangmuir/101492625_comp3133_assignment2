import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GET_EMPLOYEES, GET_EMPLOYEE, ADD_EMPLOYEE,
  UPDATE_EMPLOYEE, DELETE_EMPLOYEE, SEARCH_EMPLOYEES
} from '../../graphql/employee-queries';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo.watchQuery({ query: GET_EMPLOYEES });
  }

  getById(id: string) {
    return this.apollo.watchQuery({ query: GET_EMPLOYEE, variables: { id } });
  }

  search(searchBy: string, value: string) {
    return this.apollo.watchQuery({
      query: SEARCH_EMPLOYEES,
      variables: { searchBy, value }
    });
  }

  add(employee: any) {
    return this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: { ...employee },
      refetchQueries: [{ query: GET_EMPLOYEES }]
    });
  }

  update(id: string, employee: any) {
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, ...employee },
      refetchQueries: [{ query: GET_EMPLOYEES }]
    });
  }

  delete(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      refetchQueries: [{ query: GET_EMPLOYEES }]
    });
  }
}