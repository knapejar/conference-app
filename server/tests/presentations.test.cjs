const { PrismaClient } = require('@prisma/client');
const { createPresentation, updatePresentation } = require('../services/protected/presentations.service.cjs');
const { getPresentations } = require('../services/public/presentations.service.cjs');

const prisma = new PrismaClient();

describe('Presentations Service', () => {
    let testBlock;
    let testPresenter1;
    let testPresenter2;

    beforeAll(async () => {
        // Create test block
        testBlock = await prisma.block.create({
            data: {
                blockName: 'Test Block',
                start: new Date(),
                end: new Date(),
                presentations: {
                    create: {
                        title: 'Test Presentation',
                        description: 'Test Description',
                        presenters: {
                            create: [
                                { name: 'Zebra Presenter' },
                                { name: 'Alpha Presenter' },
                                { name: 'Beta Presenter' }
                            ]
                        }
                    }
                }
            }
        });

        // Create test presenters
        testPresenter1 = await prisma.presenter.create({
            data: {
                name: 'Test Presenter 1',
                role: 'Speaker'
            }
        });

        testPresenter2 = await prisma.presenter.create({
            data: {
                name: 'Test Presenter 2',
                role: 'Moderator'
            }
        });
    });

    afterAll(async () => {
        // Clean up test data
        await prisma.presentation.deleteMany({
            where: {
                blockId: testBlock.id
            }
        });
        await prisma.presenter.deleteMany({
            where: {
                id: {
                    in: [testPresenter1.id, testPresenter2.id]
                }
            }
        });
        await prisma.block.delete({
            where: {
                id: testBlock.id
            }
        });
        await prisma.$disconnect();
    });

    describe('createPresentation', () => {
        it('should create a presentation with multiple presenters', async () => {
            const presentationData = {
                title: 'Test Presentation',
                description: 'Test Description',
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                blockId: String(testBlock.id),
                questionsRoom: true,
                presenterIds: [String(testPresenter1.id), String(testPresenter2.id)]
            };

            const presentation = await createPresentation(presentationData);

            expect(presentation).toBeDefined();
            expect(presentation.title).toBe('Test Presentation');
            expect(presentation.presenters).toHaveLength(2);
            expect(presentation.presenters.map(p => p.id)).toContain(testPresenter1.id);
            expect(presentation.presenters.map(p => p.id)).toContain(testPresenter2.id);
        });
    });

    describe('updatePresentation', () => {
        it('should update a presentation with different presenters', async () => {
            // First create a presentation
            const presentationData = {
                title: 'Test Presentation',
                description: 'Test Description',
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                blockId: String(testBlock.id),
                questionsRoom: true,
                presenterIds: [String(testPresenter1.id)]
            };

            const presentation = await createPresentation(presentationData);

            // Then update it with different presenters
            const updateData = {
                title: 'Updated Presentation',
                description: 'Updated Description',
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                blockId: String(testBlock.id),
                questionsRoom: false,
                presenterIds: [String(testPresenter2.id)]
            };

            const updatedPresentation = await updatePresentation(String(presentation.id), updateData);

            expect(updatedPresentation).toBeDefined();
            expect(updatedPresentation.title).toBe('Updated Presentation');
            expect(updatedPresentation.presenters).toHaveLength(1);
            expect(updatedPresentation.presenters[0].id).toBe(testPresenter2.id);
        });
    });

    test('presenters should be returned in order by name', async () => {
        const blocks = await getPresentations();
        const presentation = blocks[0].presentations[0];
        const presenterNames = presentation.presenters.map(p => p.name);
        
        // Verify that presenters are in alphabetical order
        expect(presenterNames).toEqual(['Alpha Presenter', 'Beta Presenter', 'Zebra Presenter']);
    });
}); 