const { gql } = require("apollo-server-cloud-functions");

const typeDefs = gql`
  type Notification {
    id: ID
    title: String
    content: String
    userId: String
    creationDate: String
  }

  type Query {
    getNotifications: [Notification]
  }

  type Mutation {
    addNotification(
      title: String
      content: String
      userId: String
    ): Notification
  }
`;

module.exports = typeDefs;
