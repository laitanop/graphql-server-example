import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    age: Int!
    nationality: Nationality!
    friends: [User]
  }
  type Movie {
    id: ID!
    name: String!
    yearOfPublication: Int!
    isInTheaters: Boolean!
    image: String!
    description: String!
    director: String!
    genre: [String!]!
    rating: Float!
    likes: Int!
  }
  type Query {
    users: [User!]!
    user(id: ID!): User!
    movies: [Movie!]!
    movie(name: String!): Movie!
  }
  enum Nationality {
    AMERICAN
    CANADIAN
    BRITISH
    INDIAN
    AUSTRALIAN
    NEWZEALAND
    SOUTHAFRICAN
    GERMAN
    FRENCH
    SPANISH
    ITALIAN
  }
  input CreateUserInput {
    name: String!
    username: String!
    age: Int!
    nationality: Nationality!
  }
  input UpdateuserNameInput {
    id: ID!
    newUsername: String!
  }
  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUsername(input: UpdateuserNameInput!): User
    deleteUser(id: ID!): User
  }
`;
