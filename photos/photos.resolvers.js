import client from '../client';

export default {
  Photo: {
    user: ({ id }) => client.photo.findUnique({ where: { id } }).user(),
    hashtags: ({ id }) => client.photo.findUnique({ where: { id } }).hashtags(),
  },
};
