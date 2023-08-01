import {
  PrismaClient,
  User,
  Category,
  Post,
  Friendships,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const createUser = () => {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      username: faker.internet.userName(),
    },
  });
};

const createCategory = async () => {
  return await prisma.category.create({
    data: {
      name: faker.word.adjective(),
    },
  });
};

const createPost = async (author: User) => {
  return await prisma.post.create({
    data: {
      body: faker.lorem.sentence(),
      published: true,
      authorId: author.id,
    },
  });
};

const addCategories = async (categories: Category[], posts: Post[]) => {
  for await (const c of categories) {
    for await (const p of posts) {
      if (Math.random() * 100 <= 33) {
        console.log(`Associating post ${p.id} with category ${c.id}`);
        await prisma.postCategories.create({
          data: { postId: p.id, categoryId: c.id },
        });
      }
    }
  }
};

const createFollowings = async (users: User[]) => {
  for await (const followee of users) {
    for await (const follower of users) {
      if (followee.id !== follower.id) {
        if (Math.random() * 100 <= 20) {
          console.log(`User ${follower.id} is following ${followee.id}`);
          await prisma.friendships.create({
            data: {
              followeeId: followee.id,
              followerId: follower.id,
            },
          });
        }
      }
    }
  }
};

const batchCreate = async (n: number, fn) => {
  for await (const _ of new Array(n)) {
    await fn();
  }
};

async function main() {
  console.log('Clearing data...');
  await prisma.$executeRaw`DELETE FROM "PostCategories";`;
  await prisma.$executeRaw`DELETE FROM "Category";`;
  await prisma.$executeRaw`DELETE FROM "Post";`;

  await prisma.$executeRaw`DELETE FROM "Friendships";`;
  await prisma.$executeRaw`DELETE FROM "User";`;
  console.log('Creating users');
  await batchCreate(10, createUser);
  console.log('Creating categories');
  await batchCreate(5, createCategory);

  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();

  for (const u of users as User[]) {
    const rnd = Math.floor(Math.random() * 10);
    console.log(`Creating ${rnd} posts for ${u.id}`);
    await batchCreate(rnd, () => createPost(u));
  }

  const posts = await prisma.post.findMany();

  console.log('Creating Followings');
  await createFollowings(users);

  console.log('Creating Post Categories');
  await addCategories(categories, posts);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
