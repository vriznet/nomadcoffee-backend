import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      try {
        const user = await client.user.findFirst({ where: { username } });
        if (!user) {
          return {
            ok: false,
            error: 'User not found.',
          };
        }
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
          return {
            ok: false,
            error: 'Incorrect Password.',
          };
        }
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        return {
          ok: true,
          token,
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
