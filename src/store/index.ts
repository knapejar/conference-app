import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            "conferenceName": "Mobile World Congress",
            "conferenceDescription": "Mobile World Congress je největší světová výstava pro mobilní průmysl, jejíž součástí je myšlenková a vedoucí konference, na níž vystupují přední manažeři zastupující mobilní operátory, výrobce zařízení, poskytovatele technologií, prodejce a vlastníky obsahu z celého světa.",
            "motto": "Inovace v softwarovém inženýrství",
            "welcomeImage": "/assets/conference.jpg",
            "announcements": [
                {
                    id: 1,
                    title: "Welcome Message",
                    message: "Vítejte na konferenci! Zahajovací blok začíná v 9:30.",
                    date: "2024-10-21T09:00:00",
                    category: "info",
                    type: "info",
                    read: false
                },
                {
                    id: 2,
                    title: "Lunch Announcement",
                    message: "Obědový bufet je připraven v hlavním foyer.",
                    date: "2024-10-21T12:00:00",
                    category: "update",
                    type: "info",
                    read: false
                },
                {
                    id: 3,
                    title: "Closing Panel",
                    message: "Den končí uzavřením diskusního panelu ve Velkém sále.",
                    date: "2024-10-21T17:00:00",
                    category: "system",
                    type: "info",
                    read: false
                }
            ],
            "blocks": [
                {
                    "blockName": "Zahajovací blok",
                    "presentations": [
                        {
                            "start": "2024-10-21T09:30:00",
                            "end": "2024-10-21T10:00:00",
                            "title": "Vize pro rok 2024",
                            "presenter": "Petr Novák",
                            "starred": true,
                            "questionsRoom": ""
                        }
                    ]
                },
                {
                    "blockName": "Technologie budoucnosti",
                    "presentations": [
                        {
                            "start": "2024-10-21T10:15:00",
                            "end": "2024-10-21T11:00:00",
                            "title": "Umělá inteligence v reálném čase",
                            "presenter": "Jana Malá",
                            "starred": false,
                            "questionsRoom": "def456"
                        },
                        {
                            "start": "2024-10-21T10:15:00",
                            "end": "2024-10-21T11:00:00",
                            "title": "Kvantové výpočty: Kde jsme dnes?",
                            "presenter": "Martin Dvořák",
                            "starred": true,
                            "questionsRoom": "ghi789"
                        }
                    ]
                },
                {
                    "blockName": "Softwarový design",
                    "presentations": [
                        {
                            "start": "2024-10-21T11:15:00",
                            "end": "2024-10-21T12:00:00",
                            "title": "Návrhové vzory pro velké systémy",
                            "presenter": "Lucie Hrubá",
                            "starred": false,
                            "questionsRoom": "jkl101"
                        },
                        {
                            "start": "2024-10-21T11:15:00",
                            "end": "2024-10-21T12:00:00",
                            "title": "Efektivní refaktoring v praxi",
                            "presenter": "David Černý",
                            "starred": true,
                            "questionsRoom": ""
                        },
                        {
                            "start": "2024-10-21T11:15:00",
                            "end": "2024-10-21T12:00:00",
                            "title": "Architektura mikroslužeb",
                            "presenter": "Eva Švecová",
                            "starred": false,
                            "questionsRoom": "pqr123"
                        }
                    ]
                },
                {
                    "blockName": "Odpolední blok",
                    "presentations": [
                        {
                            "start": "2024-10-21T13:00:00",
                            "end": "2024-10-21T14:00:00",
                            "title": "Bezpečnostní trendy v IT",
                            "presenter": "Michal Kovář",
                            "starred": false,
                            "questionsRoom": "stu456"
                        },
                        {
                            "start": "2024-10-21T13:00:00",
                            "end": "2024-10-21T14:00:00",
                            "title": "Agilní metodiky v týmech",
                            "presenter": "Karel Veselý",
                            "starred": true,
                            "questionsRoom": "vwx789"
                        }
                    ]
                },
                {
                    "blockName": "Závěrečný panel",
                    "presentations": [
                        {
                            "start": "2024-10-21T16:00:00",
                            "end": "2024-10-21T17:00:00",
                            "title": "Diskuse o budoucnosti vývoje software",
                            "presenter": "Panel odborníků",
                            "starred": true,
                            "questionsRoom": "yz1234"
                        }
                    ]
                }
            ],
            "people": [
                {
                    "name": "Anna Nováková",
                    "role": "Keynote Speaker",
                    "imageURL": "/assets/people/anna.jpg"
                },
                {
                    "name": "Tomáš Dvořák",
                    "role": "Software Engineer",
                    "imageURL": "/assets/people/tomas.jpg"
                },
                {
                    "name": "Eva Malá",
                    "role": "Panel Moderator",
                    "imageURL": "/assets/people/eva.jpg"
                }
            ]
        };
    },
    getters: {
        conferenceName(state) {
            return state.conferenceName;
        },
        motto(state) {
            return state.motto;
        },
        welcomeImage(state) {
            return state.welcomeImage;
        },
        announcements(state) {
            return state.announcements;
        },
        blocks(state) {
            return state.blocks;
        },
        people(state) {
            return state.people;
        }
    }
});

export default store;