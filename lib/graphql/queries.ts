import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email role }
    }
  }
`;

export const GET_STUDENTS = gql`
  query GetStudents($search: String) {
    students(search: $search) {
      id name email phone course gender createdAt imageUrl
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: Int!) {
    student(id: $id) {
      id name email phone dob gender course address imageUrl createdAt
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      total
      recent { id name email course createdAt imageUrl }
    }
  }
`;

export const ADD_STUDENT = gql`
  mutation AddStudent(
    $name: String! $email: String! $phone: String $dob: String
    $gender: String $course: String! $address: String $imageUrl: String
  ) {
    addStudent(
      name: $name email: $email phone: $phone dob: $dob
      gender: $gender course: $course address: $address imageUrl: $imageUrl
    ) {
      id name email course
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: Int! $name: String $email: String $phone: String $dob: String
    $gender: String $course: String $address: String $imageUrl: String
  ) {
    updateStudent(
      id: $id name: $name email: $email phone: $phone dob: $dob
      gender: $gender course: $course address: $address imageUrl: $imageUrl
    ) {
      id name email course
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: Int!) {
    deleteStudent(id: $id) { success id }
  }
`;

export const GET_ME = gql`
  query Me {
    me { id email role }
  }
`;
