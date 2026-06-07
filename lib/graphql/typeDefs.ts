import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Student {
    id: Int!
    name: String!
    email: String!
    phone: String
    dob: String
    gender: String
    course: String!
    address: String
    imageUrl: String
    createdAt: String!
  }

  type User {
    id: Int!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type DashboardStats {
    total: Int!
    recent: [Student!]!
  }

  type DeleteResult {
    success: Boolean!
    id: Int!
  }

  type Query {
    students(search: String): [Student!]!
    student(id: Int!): Student
    dashboardStats: DashboardStats!
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    addStudent(
      name: String!
      email: String!
      phone: String
      dob: String
      gender: String
      course: String!
      address: String
      imageUrl: String
    ): Student!
    updateStudent(
      id: Int!
      name: String
      email: String
      phone: String
      dob: String
      gender: String
      course: String
      address: String
      imageUrl: String
    ): Student!
    deleteStudent(id: Int!): DeleteResult!
  }
`;
