const { gql } = require("apollo-server-cloud-functions");

const typeDefs = gql`
  type Notification {
    id: ID
    type: String
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
      type: String
      title: String
      content: String
      userId: String
    ): Notification
  }
`;

module.exports = typeDefs;
