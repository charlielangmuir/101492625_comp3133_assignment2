import { gql } from 'apollo-angular';

const EMP_FIELDS = gql`
  fragment EmpFields on Employee {
    _id first_name last_name email gender
    designation department salary date_of_joining
    employee_photo
  }
`;

export const GET_EMPLOYEES = gql`
  query { getAllEmployees { ...EmpFields } }
  ${EMP_FIELDS}
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    searchEmployeeByEid(eid: $id) { ...EmpFields }
  }
  ${EMP_FIELDS}
`;

export const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($searchBy: String!, $value: String!) {
    searchEmployeeByDesignationOrDepartment(searchBy: $searchBy, value: $value) {
      ...EmpFields
    }
  }
  ${EMP_FIELDS}
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String! $last_name: String! $email: String!
    $gender: String! $designation: String! $department: String!
    $salary: Float! $date_of_joining: String! $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name last_name: $last_name email: $email
      gender: $gender designation: $designation department: $department
      salary: $salary date_of_joining: $date_of_joining employee_photo: $employee_photo
    ) { _id }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID! $first_name: String $last_name: String $email: String
    $gender: String $designation: String $department: String
    $salary: Float $date_of_joining: String $employee_photo: String
  ) {
    updateEmployee(
      eid: $id first_name: $first_name last_name: $last_name email: $email
      gender: $gender designation: $designation department: $department
      salary: $salary date_of_joining: $date_of_joining employee_photo: $employee_photo
    ) { _id }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(eid: $id)
  }
`;
