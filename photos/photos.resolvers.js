import client from '../client';

export default {
  Photo: {
    user: ({ id }) => client.photo.findUnique({ where: { id } }).user(),
    hashtags: ({ id }) => client.photo.findUnique({ where: { id } }).hashtags(),
  },
  Hashtag: {
    photos: ({ id }, { page }) => {
      return client.hashtag.findUnique({ where: { id } }).photos({
        take: 5,
        skip: (page - 1) * 5,
      });
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};
