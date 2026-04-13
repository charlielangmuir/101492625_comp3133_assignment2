import { gql } from 'apollo-angular';

export const LOGIN_QUERY = gql`
  query Login($usernameOrEmail: String!, $password: String!) {
    login(input: { usernameOrEmail: $usernameOrEmail, password: $password }) {
      token
      message
      user { _id username email }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(input: { username: $username, email: $email, password: $password }) {
      _id username email
    }
  }
`;