import client from '../../client';
import { protectedResolver } from '../users.utils';

const followUserResolver = async (_, { username }, { loggedInUser }) => {
  try {
    const ok = await client.user.findUnique({ where: { username } });
    if (!ok) {
      return {
        ok: false,
        error: 'That user does not exist.',
      };
    }
    await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        following: {
          connect: {
            username,
          },
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
    followUser: protectedResolver(followUserResolver),
  },
};
