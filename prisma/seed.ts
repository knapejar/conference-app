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
      name: 'Baťův odkaz světu 2025',
      description: 'Konference o synergii lidí, technologií a odkazu Tomáše Bati.',
      welcomeImage: './assets/batuv-odkaz-2025.jpg',
    },
  });

  // Uvítací announcement
  await prisma.announcement.create({
    data: {
      title: 'Vítejte na konferenci Baťův odkaz světu 2025',
      message: 'Těší nás, že jste s námi! Připravili jsme pro vás pestrý program plný inspirativních osobností a témat.',
      date: new Date('2025-04-25T08:00:00Z'),
      category: 'General',
      type: 'Welcome',
      read: false,
    },
  });

  const plenaryBlock = await prisma.block.create({
    data: {
      blockName: 'Zahájení konference',
      start: new Date('2025-04-25T09:00:00Z'),
      end: new Date('2025-04-25T10:30:00Z')
    },
  });

  const plenaryPresentation = await prisma.presentation.create({
    data: {
      title: 'Plenární diskuse: Lidé a technologie',
      description: 'Diskuse o synergii lidí a technologií v moderním světě. Plenární zasedání moredují Ján Košturiak, Dominik Stroukal a Drahomíra Pavelková.',
      start: new Date('2025-04-25T09:00:00Z'),
      end: new Date('2025-04-25T10:30:00Z'),
      questionsRoom: true,
      block: { connect: { id: plenaryBlock.id } },
    },
  });

  const plenaryPresenters = [
    {
      name: 'Artur Gevorkyan',
      role: 'generální ředitel, Gevorkyan, a.s.',
      details: '​Artur Gevorkyan je zakladatel, předseda představenstva a generální ředitel společnosti GEVORKYAN, a.s., která je evropským lídrem v oblasti práškové metalurgie. Společnost byla založena v roce 1996 v Banské Bystrici a od té doby se vypracovala na globálního dodavatele komponentů pro automobilový, letecký, zbrojní a další průmysly. Gevorkyan, původem z Arménie, je vojenský letecký inženýr a podnikatel, který staví na více než 50letých zkušenostech své rodiny v oboru. Pod jeho vedením firma dodává své produkty do více než 30 zemí světa a ročně vyvíjí přes 150 nových výrobků. Jeho úsilí a inovativní přístup byly oceněny titulem TREND TOP Manažer roku 2025 a oceněním Křišťálové křídlo v kategorii Hospodářství za rok 2023.',
    },
    {
      name: 'David Pavlík',
      role: 'Chief Technology Officer, NanoEnergies, SpaceX',
      details: 'David Pavlík je český technologický expert a manažer s bohatými zkušenostmi z předních světových firem. Působil ve společnostech jako Microsoft, Amazon, Netflix a SpaceX, kde se podílel na vývoji a implementaci pokročilých technologií. V České republice byl známý jako technologický ředitel startupu Kiwi.com, kde vedl technologické inovace v oblasti cestování. Jeho kariéra je příkladem úspěšného propojení českého technologického talentu s globálními lídry v oboru. David Pavlík je také aktivní v podpoře technologického vzdělávání a startupové komunity v Česku.',
    },
    {
      name: 'Eva Jiřičná',
      role: 'architektka a designérka, AI DESIGN',
      details: 'Eva Jiřičná je světově uznávaná architektka a designérka, narozená ve Zlíně v roce 1939. Po srpnové okupaci v roce 1968 zůstala v Londýně, kde založila vlastní architektonické studio a proslavila se návrhy interiérů pro značky jako Harrods, Joseph či Lloyd’s. Její tvorba je charakteristická použitím skla, oceli a elegantních točitých schodišť, která kombinují technickou preciznost s estetickou lehkostí. V České republice navrhla například Kongresové centrum a Univerzitní centrum ve Zlíně či novou oranžerii na Pražském hradě. Za své celoživotní dílo obdržela řadu ocenění, včetně Řádu britského impéria a Pocty České komory architektů. ',
    },
    {
      name: 'Helena Horská',
      role: 'hlavní ekonomka Raiffeisenbank, členka NERV',
      details: 'Helena Horská je renomovaná česká ekonomka, která působí jako hlavní ekonomka Raiffeisenbank. Vystudovala ekonomii na Vysoké škole ekonomické v Praze a získala doktorský titul. Je členkou dozorčí rady banky a aktivně se podílí na tvorbě ekonomických strategií. Kromě toho je poradkyní premiéra Petra Fialy a členkou Národní ekonomické rady vlády. Spoluzaložila iniciativu Ministr Zdraví, která se zaměřuje na inovace ve zdravotnictví, a je členkou platformy KoroNERV-20, která hledá řešení ekonomických dopadů pandemie. ',
    },
    {
      name: 'Ivan Baťka',
      role: 'generální ředitel, Fosfa, a.s.',
      details: 'Ivan Baťka je český podnikatel a majitel břeclavské chemičky Fosfa, největšího zpracovatele žlutého fosforu v Evropě. Transformoval Fosfu z předluženého podniku na moderní firmu s důrazem na ekologii a udržitelnost. Je zakladatelem značek FeelEco (ekologická drogerie) a FeelGreens (vertikální hydroponická farma). Baťka se inspiruje baťovskými principy a klade důraz na průběžné zlepšování výkonu i prostředí své firmy. Jeho podnikatelský přístup kombinuje prvorepublikové hodnoty s moderními technologiemi a ekologickým myšlením. ​',
    },
    {
      name: 'Milan Adámek',
      role: 'rektor Univerzity Tomáše Bati ve Zlíně',
      details: 'Milan Adámek je český politik a od roku 2014 primátor města Zlín. Před vstupem do politiky působil jako podnikatel v oblasti stavebnictví. Jako primátor se zaměřuje na rozvoj města, podporu infrastruktury a zlepšení kvality života obyvatel. Pod jeho vedením Zlín realizoval řadu investičních projektů, včetně modernizace veřejných prostor a dopravní infrastruktury. Adámek je známý svým pragmatickým přístupem a snahou o transparentní řízení města.',
    },
    {
      name: 'Mojmír Hampl',
      role: 'předseda Národní rozpočtové rady, člen NERV',
      details: 'Mojmír Hampl je český ekonom a od července 2022 předseda Národní rozpočtové rady. V letech 2008 až 2018 působil jako viceguvernér České národní banky. Má zkušenosti z akademické sféry i soukromého sektoru, včetně působení v KPMG Česká republika. Hampl je známý svými odbornými názory na měnovou politiku, veřejné finance a evropskou integraci. Aktivně publikuje a přednáší na témata spojená s ekonomikou a finanční stabilitou. ',
    },
    {
      name: 'Petr Očko',
      role: 'vrchní ředitel, MPO – sekce digitalizace a inovací',
      details: 'Petr Očko je český ekonom a od roku 2019 vrchní ředitel sekce digitalizace a inovací na Ministerstvu průmyslu a obchodu. Vystudoval informační management a evropskou integraci na Vysoké škole ekonomické v Praze a získal Ph.D. v oblasti informační ekonomiky. Má zkušenosti z veřejné správy i soukromého sektoru, včetně působení v agentuře CzechInvest a společnosti Telefónica O2. Očko se zaměřuje na podporu inovací, digitalizace a průmyslového výzkumu v České republice. Jeho cílem je posílit konkurenceschopnost českého průmyslu prostřednictvím moderních technologií a inovativních řešení. ',
    },
    {
      name: 'Petr Sáha',
      role: 'ředitel UNI, Univerzita Tomáše Bati ve Zlíně',
      details: 'Petr Sáha je český vědec a pedagog, specializující se na polymery a materiálové inženýrství. Působil jako rektor Univerzity Tomáše Bati ve Zlíně a významně se podílel na jejím rozvoji. Je autorem řady odborných publikací a držitelem několika patentů v oblasti polymerních materiálů. Sáha se zasazuje o propojení vědy s praxí a podporu inovací v průmyslu. Jeho práce přispěla k posílení postavení České republiky v oblasti materiálového výzkumu.',
    },
    {
      name: 'Radomír Lapčík',
      role: 'zakladatel Trinity Bank a.s., SAB Finance, a.s.',
      details: 'Radomír Lapčík je český bankéř a podnikatel, zakladatel a majoritní akcionář Trinity Bank. V bankovnictví působí od 90. let a je známý svým konzervativním přístupem k řízení rizik. Pod jeho vedením se Trinity Bank zaměřuje na poskytování služeb pro bonitní klientelu a malé a střední podniky. Lapčík je také filantrop, podporující řadu kulturních a vzdělávacích projektů. Jeho podnikatelská filozofie klade důraz na stabilitu, důvěru a dlouhodobé vztahy s klienty.',
    },
  ];
  
  const createdPresenters = await Promise.all(
    plenaryPresenters.map(({ name, role, details }) =>
      prisma.presenter.create({
        data: {
          name,
          role,
          details,
          imageURL: '/assets/user-placeholder.svg',
        },
      })
    )
  );

  // Connect presenters to the plenary presentation
  await prisma.presentation.update({
    where: { id: plenaryPresentation.id },
    data: {
      presenters: {
        connect: createdPresenters.map(presenter => ({ id: presenter.id }))
      }
    }
  });

  const blocksData = [
    {
      name: 'Registrace',
      start: new Date('2025-04-25T06:00:00Z'),
      end: new Date('2025-04-25T07:30:00Z'),
    },
    {
      name: 'Workshop: Transformace průmyslu ve Střední Evropě',
      presenter: ['Ján Košturiak'],
      start: new Date('2025-04-25T09:00:00Z'),
      end: new Date('2025-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Technologie a humanita',
      presenter: ['Jaroslav Dlabač', 'Marcel Pavelka'],
      start: new Date('2025-04-25T09:00:00Z'),
      end: new Date('2025-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Připravenost na změny',
      presenter: ['Jan Mašek', 'Luboš Malý'],
      start: new Date('2025-04-25T09:00:00Z'),
      end: new Date('2025-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Naplnění motivátorů',
      presenter: ['Jana Matošková'],
      start: new Date('2025-04-25T09:00:00Z'),
      end: new Date('2025-04-25T11:00:00Z'),
    },
    {
      name: 'Workshop: Inspiruj se Baťou',
      presenter: ['Gabriela Končitíková', 'Jakub Malovaný'],
      start: new Date('2025-04-25T09:00:00Z'),
      end: new Date('2025-04-25T11:00:00Z'),
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

    // Create presenters for this workshop
    const workshopPresenters = await Promise.all(
      block.presenter.map(name =>
        prisma.presenter.create({
          data: {
            name,
            role: 'Lektor',
            imageURL: '',
            details: 'Workshopový lektor',
          },
        })
      )
    );

    // Connect presenters to the workshop presentation
    await prisma.presentation.update({
      where: { id: presentation.id },
      data: {
        presenters: {
          connect: workshopPresenters.map(presenter => ({ id: presenter.id }))
        }
      }
    });
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
