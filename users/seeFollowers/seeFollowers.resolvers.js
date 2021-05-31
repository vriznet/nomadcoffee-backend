import client from '../../client';

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      try {
        const ok = await client.user.findUnique({
          where: { username },
          select: {
            id: true,
          },
        });
        if (!ok) {
          return {
            ok: false,
            error: 'That user does not exist.',
          };
        }
        const followers = await client.user
          .findUnique({
            where: { username },
          })
          .followers({
            take: 5,
            skip: (page - 1) * 5,
          });
        const totalFollowers = await client.user.count({
          where: {
            following: {
              some: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
          followers,
          totalPages: Math.ceil(totalFollowers / 5),
        };
      } catch (error) {
        console.error(error);
        return {
          ok: false,
          error: `${error}`,
        };
      }
    },
  },
};
