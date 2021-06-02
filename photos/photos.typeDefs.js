import { gql } from 'apollo-server-express';

export default gql`
  type Photo {
    id: String!
    user: User
    file: String!
    caption: String
    hashtags: [Hashtag]
    likes: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Hashtag {
    id: String!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Like {
    id: String!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
