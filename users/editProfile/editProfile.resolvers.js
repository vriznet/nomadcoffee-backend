import { createWriteStream } from 'fs';
import bcrypt from 'bcrypt';
import client from '../../client';
import { protectedResolver } from '../users.utils';

const editProfileResolver = async (
  _,
  {
    username,
    email,
    name,
    location,
    password: newPassword,
    avatarURL,
    githubUsername,
  },
  { loggedInUser }
) => {
  try {
    let avatarUrl = null;
    if (avatarURL) {
      const { filename, createReadStream } = await avatarURL;
      const formattedFilename = `${
        loggedInUser.id
      }-${Date.now().toString()}-${filename}`;
      const readStream = createReadStream();
      const writeStream = createWriteStream(
        process.cwd() + '/uploads/' + formattedFilename
      );
      readStream.pipe(writeStream);
      avatarUrl = `http://localhost:4000/static/${formattedFilename}`;
    }

    let uglyPassword = null;
    if (newPassword) {
      uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
      where: { id: loggedInUser.id },
      data: {
        username,
        email,
        name,
        location,
        githubUsername,
        ...(uglyPassword && { password: uglyPassword }),
        ...(avatarUrl && { avatarURL: avatarUrl }),
      },
    });
    if (updatedUser) return { ok: true };
    else return { ok: false, error: 'Could not update profile.' };
  } catch (error) {
    console.log(error);
    return { ok: false, error: `${error}` };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(editProfileResolver),
  },
};
