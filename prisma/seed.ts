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
      description: `Konference o synergii lidí, technologií a odkazu Tomáše Bati. Přijďte diskutovat o tomto tématu s odborníky, s osobnostmi firemního, vzdělávacího a veřejného života.`,
      welcomeImage: './assets/batuv-odkaz-2024.jpg',
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

  const presenters = [
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
    presenters.map(({ name, role, details }) =>
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

  const blocksData = [
    {
      name: 'Registrace',
      start: new Date('2025-04-25T06:00:00Z'),
      end: new Date('2025-04-25T07:30:00Z'),
    },
    {
      blockName: 'Zahájení konference',
      start: new Date('2025-04-25T07:30:00Z'),
      end: new Date('2025-04-25T10:00:00Z'),
      presentations: [
        {
          title: 'Plenární diskuse: Lidé a technologie',
          description: 'Plenární zasedání moderují Ján Košturiak, Dominik Stroukal a Drahomíra Pavelková.',
          start: new Date('2025-04-25T07:30:00Z'),
          end: new Date('2025-04-25T10:00:00Z'),
          questionsRoom: false,
          presenters: ["Artur Gevorkyan", "David Pavlík", "Eva Jiřičná", "Helena Horská", "Ivan Baťka", "Milan Adámek", "Mojmír Hampl", "Petr Očko", "Petr Sáha", "Radomír Lapčík"],
        },
      ]
    },
    {
      blockName: 'Oběd',
      start: new Date('2025-04-25T10:00:00Z'),
      end: new Date('2025-04-25T11:00:00Z'),
    },
    {
      blockName: 'Jednání v sekcích (blok A)',
      start: new Date('2025-04-25T11:00:00Z'),
      end: new Date('2025-04-25T13:00:00Z'),
      presentations: [
        {
          title: 'Nové úkoly a požadavky na průmyslové inženýry',
          description: 'Průmysloví inženýři byli kdysi pozorovatelé procesů a sběratelé údajů z výroby. Dnes se stávají analytiky a mají množství údajů v reálném čase z různých oblastí podniku. I v této oblasti lidé narážejí na své schopnosti.Kde jsou budoucí role průmyslových inženýrů v podnicích? Kolik své pozornosti budou věnovat strojům a lidem? Jak budou pracovat a jaké nové metody a postupy si musí osvojit?',
          start: new Date('2025-04-25T11:00:00Z'),
          end: new Date('2025-04-25T12:30:00Z'),
          questionsRoom: true,
          presenters: ["Artur Gevorkyan", "David Pavlík"],
        },
        {
          title: 'Lidé a technologie: Synergie pro budoucnost',
          description: 'Synergie mezi lidmi a technologiemi je stavebním kamenem budoucího světa. Harmonická spolupráce otevírá dveře k nekonečným možnostem inovací a rozvoje, přinášejících prosperitu a lepší kvalitu života pro nás všechny. Jak tato synergie může maximalizovat přínosy lidských schopností na jedné straně a možností, které nabízí technologie na druhé straně a zároveň minimalizovat omezení každé z nich?',
          start: new Date('2025-04-25T11:00:00Z'),
          end: new Date('2025-04-25T12:30:00Z'),
          questionsRoom: true,
          presenters: ["Eva Jiřičná", "Helena Horská"],
        },
        {
          title: 'Rozhodování místních samospráv: data vs. emoce',
          description: 'Obce, města i kraje prakticky neustále rozhodují o zásadních otázkách, které mají dopad na život každého z nás. Přitom se pohybují ve stále složitějším a informačně nabitějším světě. Využívají pro svá zásadní rozhodnutí dostatek evidence a dat? A jakou roli hraje v rozhodování psychologie? Jaké jsou moderní metody předvídání budoucího vývoje? A jak řídil město Baťa? Lze najít inspiraci?',
          start: new Date('2025-04-25T11:00:00Z'),
          end: new Date('2025-04-25T12:30:00Z'),
          questionsRoom: true,
          presenters: ["Ivan Baťka", "Milan Adámek"],
        }
      ]
    },
    {
      blockName: 'Pauza s občerstvením',
      start: new Date('2025-04-25T13:00:00Z'),
      end: new Date('2025-04-25T13:30:00Z'),
    },
    {
      blockName: 'Jednání v sekcích (blok B)',
      start: new Date('2025-04-25T13:30:00Z'),
      end: new Date('2025-04-25T15:30:00Z'),
      presentations: [
        {
          title: 'Jak nové technologie mění průmyslové inženýrství?',
          description: 'Do podniků nastupují nové technologie a lidé se učí spolupracovat nejen s kolaborativními roboty, ale také s roboty, které pomáhají v duševní a kreativní práci. Máme digitální dvojčata, která nám umožňují vidět dříve neviditelná plýtvání a máme technologie na ovládání „zhaslé“ fabriky na dálku. Jak nové technologie mění průmyslové inženýrství, přístupy a postupy průmyslových inženýrů k řízení podniku?',
          start: new Date('2025-04-25T13:30:00Z'),
          end: new Date('2025-04-25T15:30:00Z'),
          questionsRoom: true,
          presenters: ["Mojmír Hampl", "Petr Očko"],
        },
        {
          title: 'Služba zákazníkovi v digitální době',
          description: 'Jaké možnosti nabízí současná doba pro zážitek, který by si měl zákazník odnášet z nákupu? A je možné vytvořit vztah mezi brandem a zákazníkem? Při pohledu na loga firmy Baťa si zákazník neměl vybavit pouze obuv, ale zážitek, který si odnese z prodejny. Jak dnešní firmy vytváří to „něco navíc“, aby si k nim zákazník vytvořil vztah? Jak nezískat pouze peníze zákazníka, ale také jeho přízeň a srdce?',
          start: new Date('2025-04-25T13:30:00Z'),
          end: new Date('2025-04-25T15:30:00Z'),
          questionsRoom: true,
          presenters: ["Petr Sáha", "Milan Adámek", "Radomír Lapčík"],
        },
        {
          title: 'Řízení chytrých měst a regionů: realita vs. vize',
          description: 'Koncept chytrých měst a regionů je stále více zastoupen v činnosti našich měst a regionů a spolu s nimi množství digitálních řešení a nastupující internet věcí a umělá inteligence. Avšak, jsou skutečně všechna řešení chytrá? Umíme chytrá města řídit? Jak nastavit procesy řízení a rozhodování v chytrých městech, a co občan a návštěvník? A lze využít některé přístupy Tomáše Bati při řízení chytrých měst?',
          start: new Date('2025-04-25T13:30:00Z'),
          end: new Date('2025-04-25T15:30:00Z'),
          questionsRoom: true,
          presenters: ["Ivan Baťka"],
        }
      ]
    },
    {
      blockName: 'Večerní program',
      start: new Date('2025-04-25T17:00:00Z'),
      end: new Date('2025-04-25T21:00:00Z'),
      presentations: [
        {
          title: 'Společenský večer - Baťova vila',
          description: 'Včetně komentované prohlídky Baťovy vily.',
          start: new Date('2025-04-25T17:00:00Z'),
          end: new Date('2025-04-25T19:00:00Z'),
          questionsRoom: false,
          presenters: ["Eva Jiřičná", "Milan Adámek", "Radomír Lapčík", "Petr Sáha"],
        },
      ]
    }
  ];

  const presenterMap = Object.fromEntries(
    createdPresenters.map((p) => [p.name, p.id])
  );

  for (const block of blocksData) {
    await prisma.block.create({
      data: {
        blockName: block.blockName ?? (block as any).name,
        start: block.start,
        end: block.end,
        presentations: block.presentations
          ? {
            create: block.presentations.map(
              ({
                title,
                description,
                start,
                end,
                questionsRoom,
                presenters,
              }) => ({
                title,
                description,
                start,
                end,
                questionsRoom,
                presenters: {
                  connect: presenters.map((name) => ({
                    id: presenterMap[name]!,
                  })),
                },
              })
            ),
          }
          : undefined,
      },
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
