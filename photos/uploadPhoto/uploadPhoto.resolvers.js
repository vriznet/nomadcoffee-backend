import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
const uploadPhotoResolver = async (_, { file, caption }, { loggedInUser }) => {
  let hashtagObjs = null;
  if (caption) {
    const hashtags = caption.match(/#[\w]+/g);
    hashtagObjs = hashtags.map((hashtag) => ({
      where: { hashtag },
      create: { hashtag },
    }));

    const photo = await client.photo.create({
      data: {
        file,
        caption,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        ...(hashtagObjs.length > 0 && {
          hashtags: {
            connectOrCreate: hashtagObjs,
          },
        }),
      },
    });
    return photo;
  }
};
export default {
  Mutation: {
    uploadPhoto: protectedResolver(uploadPhotoResolver),
  },
};
