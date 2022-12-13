const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ApolloServer } = require("apollo-server-cloud-functions");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const typeDefs = require("./schema");

admin.initializeApp();
const db = admin.firestore();

const resolvers = {
  Query: {
    getNotifications: () => {
      return new Promise((resolve, reject) => {
        fetchAllNotifications((data) => {
          resolve(data);
        });
      });
    },
  },
  Mutation: {
    addNotification: (parent, { type, title, content, userId }) => {
      return new Promise((resolve, reject) => {
        createNotification(
          (data) => {
            resolve(data);
          },
          type,
          title,
          content,
          userId
        );
      });
    },
  },
};

const fetchAllNotifications = (callback) => {
  db.collection("notifications")
    .get()
    .then((item) => {
      const items = [];
      item.docs.forEach((item) => {
        items.push(item.data());
      });
      return callback(items);
    })
    .catch((e) => console.log(e));
};

// Example
// mutation Mutation($type: String, $title: String, $content: String, $userId: String) {
//   addNotification(type: $type, title: $title, content: $content, userId: $userId) {
//     type
//     content
//     creationDate
//     id
//     title
//     userId
//   }
// }
// Variables:
// {
//   "type": "payin",
//   "title": "Payment received!",
//   "content": "You have received a payment from Lupita Estrada. The amount is $1,700 MXN.",
//   "userId": "2g425er0-9274-4d47-81c8-9301fc477bf2",
// }

const createNotification = (callback, type, title, content, userId) => {
  const newDocRef = db.collection("notifications").doc();
  const docData = {
    id: newDocRef.id,
    type,
    title,
    content,
    userId,
    creationDate: Date.now(),
  };
  newDocRef
    .set(docData)
    .then((item) => {
      return callback(docData);
    })
    .catch((e) => console.log(e));
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  context: ({ req, res }) => ({
    headers: req.headers,
    req,
    res,
  }),
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  introspection: process.env.NODE_ENV !== "production",
});

const handler = server.createHandler();
exports.graphql = functions.https.onRequest(handler);
