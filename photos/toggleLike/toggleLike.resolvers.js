import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const toggleLikeResolver = async (_, { id }, { loggedInUser }) => {
  try {
    const existingPhoto = await client.photo.findUnique({
      where: { id },
    });
    if (!existingPhoto) {
      return {
        ok: false,
        error: 'Photo not found.',
      };
    }
    const likeWhere = {
      photoId_userId: {
        userId: loggedInUser.id,
        photoId: id,
      },
    };
    const like = await client.like.findUnique({
      where: likeWhere,
    });

    if (like) {
      await client.like.delete({
        where: likeWhere,
      });
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          photo: {
            connect: {
              id: existingPhoto.id,
            },
          },
        },
      });
    }
    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: `${error}`,
    };
  }
};

export default {
  Mutation: {
    toggleLike: protectedResolver(toggleLikeResolver),
  },
};
