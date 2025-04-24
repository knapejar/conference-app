import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.announcement.deleteMany(),
    prisma.question.deleteMany(),
    prisma.presenter.deleteMany(),
    prisma.presentation.deleteMany(),
    prisma.block.deleteMany(),
    prisma.conference.deleteMany(),
  ]);

  const blocks = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.block.create({
        data: { blockName: `Block ${i + 1}` },
      })
    )
  );

  const conference = await Promise.all(
    Array.from({ length: 1 }, () =>
      prisma.conference.create({
        data: {
          name: 'Mobile World Congress',
          description: "The world's most influential event for the connectivity industry.",
          welcomeImage: './assets/conference.jpg',
        },
      })
    )
  );

  const presentations = await Promise.all(
    blocks.flatMap(block =>
      Array.from({ length: 3 }, (_, i) =>
        prisma.presentation.create({
          data: {
            start: faker.date.future(),
            end: faker.date.future(),
            title: `Presentation ${i + 1}`,
            description: faker.lorem.paragraph(),
            questionsRoom: Math.random() < 0.5,
            block: { connect: { id: block.id } },
          },
        })
      )
    )
  );

  const presenters = await Promise.all(
    presentations.flatMap(presentation =>
      Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) =>
        prisma.presenter.create({
          data: {
            name: faker.person.fullName(),
            role: faker.person.jobTitle(),
            imageURL: faker.image.avatar(),
            details: faker.lorem.paragraph(),
            presentation: { connect: { id: presentation.id } },
          },
        })
      )
    )
  );

  await Promise.all(
    Array.from({ length: 5 }, () =>
      prisma.announcement.create({
        data: {
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          date: faker.date.recent(),
          category: 'General',
          type: 'Important',
          read: false,
        },
      })
    )
  );

  console.log('Database seeded successfully!');
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