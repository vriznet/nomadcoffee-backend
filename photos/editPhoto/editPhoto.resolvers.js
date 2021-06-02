import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
import { buildHashtagObjs } from '../photos.utils';

const editPhotoResolver = async (_, { id, caption }, { loggedInUser }) => {
  try {
    const oldPhoto = await client.photo.findFirst({
      where: {
        id,
        userId: loggedInUser.id,
      },
      include: {
        hashtags: {
          select: {
            hashtag: true,
          },
        },
      },
    });
    if (!oldPhoto) {
      return {
        ok: false,
        error: 'Photo not found.',
      };
    }
    await client.photo.update({
      where: {
        id,
      },
      data: {
        caption,
        hashtags: {
          disconnect: oldPhoto.hashtags,
          connectOrCreate: buildHashtagObjs(caption),
        },
      },
    });
    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: `${error}`,
    };
  }
};
export default {
  Mutation: {
    editPhoto: protectedResolver(editPhotoResolver),
  },
};
