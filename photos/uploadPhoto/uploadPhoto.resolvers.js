import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
import { buildHashtagObjs } from '../photos.utils';
const uploadPhotoResolver = async (_, { file, caption }, { loggedInUser }) => {
  let hashtagObjs = [];
  if (caption) {
    hashtagObjs = buildHashtagObjs(caption);

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
