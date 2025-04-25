import { PrismaClient } from '@prisma/client';

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

  const conference = await prisma.conference.create({
    data: {
      name: 'Baťův odkaz světu 2024',
      description: 'Konference o synergii lidí, technologií a odkazu Tomáše Bati.',
      welcomeImage: './assets/batuv-odkaz-2024.jpg',
    },
  });

  // Uvítací announcement
  await prisma.announcement.create({
    data: {
      title: 'Vítejte na konferenci Baťův odkaz světu 2024',
      message: 'Těší nás, že jste s námi! Připravili jsme pro vás pestrý program plný inspirativních osobností a témat.',
      date: new Date('2024-04-25T08:00:00Z'),
      category: 'General',
      type: 'Welcome',
      read: false,
    },
  });

  const plenaryBlock = await prisma.block.create({
    data: {
      blockName: 'Plenární zasedání',
      start: new Date('2024-04-25T09:00:00Z'),
      end: new Date('2024-04-25T10:30:00Z')
    },
  });

  const plenaryPresentation = await prisma.presentation.create({
    data: {
      title: 'Plenární diskuse: Lidé a technologie',
      description: 'Diskuse o synergii lidí a technologií v moderním světě.',
      start: new Date('2024-04-25T09:00:00Z'),
      end: new Date('2024-04-25T10:30:00Z'),
      questionsRoom: true,
      block: { connect: { id: plenaryBlock.id } },
    },
  });

  const plenaryPresenters = [
    'Milan Adámek',
    'Ivan Baťka',
    'Artur Gevorkyan',
    'Mojmír Hampl',
    'Helena Horská',
    'Eva Jiřičná',
    'Radomír Lapčík',
    'Petr Očko',
    'David Pavlík',
    'Petr Sáha',
  ];

  for (const name of plenaryPresenters) {
    await prisma.presenter.create({
      data: {
        name,
        role: 'Panelista',
        imageURL: '', // Můžeš později doplnit obrázky
        details: 'Účastník diskuse na plenárním zasedání',
        presentation: { connect: { id: plenaryPresentation.id } },
      },
    });
  }

  const blocksData = [
    {
      name: 'Oběd',
      start: new Date('2024-04-25T13:30:00Z'),
      end: new Date('2024-04-25T14:30:00Z'),
    },
    {
      name: 'Workshop: Transformace průmyslu ve Střední Evropě',
      presenter: ['Ján Košturiak'],
      start: new Date('2024-04-25T09:00:00Z'),
      end: new Date('2024-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Technologie a humanita',
      presenter: ['Jaroslav Dlabač', 'Marcel Pavelka'],
      start: new Date('2024-04-25T09:00:00Z'),
      end: new Date('2024-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Připravenost na změny',
      presenter: ['Jan Mašek', 'Luboš Malý'],
      start: new Date('2024-04-25T09:00:00Z'),
      end: new Date('2024-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Naplnění motivátorů',
      presenter: ['Jana Matošková'],
      start: new Date('2024-04-25T09:00:00Z'),
      end: new Date('2024-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Inspiruj se Baťou',
      presenter: ['Gabriela Končitíková', 'Jakub Malovaný'],
      start: new Date('2024-04-25T09:00:00Z'),
      end: new Date('2024-04-25T11:00:00Z'),
    },
  ];

  for (const block of blocksData) {
    const createdBlock = await prisma.block.create({
      data: {
        blockName: block.name,
        start: block.start,
        end: block.end
      },
    });

    if (!block.presenter) continue;

    const presentation = await prisma.presentation.create({
      data: {
        title: block.name,
        description: `Workshop v rámci konference Baťův odkaz světu.`,
        start: block.start,
        end: block.end,
        questionsRoom: false,
        block: { connect: { id: createdBlock.id } },
      },
    });

    for (const name of block.presenter) {
      await prisma.presenter.create({
        data: {
          name,
          role: 'Lektor',
          imageURL: '',
          details: 'Workshopový lektor',
          presentation: { connect: { id: presentation.id } },
        },
      });
    }
  }

  console.log('Database seeded successfully with real data!');
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
