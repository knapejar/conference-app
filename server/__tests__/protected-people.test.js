const { prisma } = require('../testSetup.cjs');
const { createPerson, updatePerson, deletePerson } = require('../services/protected/people.service.cjs');
const { HttpError } = require('../utils/errors.cjs');

describe('Protected People Module', () => {
    const mockPerson = {
        id: 1,
        name: 'Test Person',
        role: 'Test Role',
        imageURL: 'test.jpg',
        details: 'Test Details',
        presentations: [
            {
                id: 1,
                title: 'Test Presentation',
                description: 'Test Description',
                start: new Date(),
                end: new Date(),
                questionsRoom: true
            }
        ]
    };

    const mockPresenters = [
        mockPerson,
        {
            id: 2,
            name: 'Another Person',
            role: 'Another Role',
            imageURL: 'another.jpg',
            details: 'Another Details',
            presentations: [
                {
                    id: 2,
                    title: 'Another Presentation',
                    description: 'Another Description',
                    start: new Date(),
                    end: new Date(),
                    questionsRoom: true
                }
            ]
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPerson', () => {
        it('should create a new person and return all presenters sorted by name', async () => {
            prisma.presentation.findUnique.mockResolvedValue({ id: 1 });
            prisma.presenter.create.mockResolvedValue(mockPerson);
            prisma.presenter.findMany.mockResolvedValue(mockPresenters);

            const result = await createPerson({
                name: 'Test Person',
                role: 'Test Role',
                imageURL: 'test.jpg',
                details: 'Test Details',
                presentationId: 1
            });
            expect(result).toEqual(mockPresenters);
            expect(prisma.presenter.findMany).toHaveBeenCalledWith({
                orderBy: {
                    name: 'asc'
                }
            });
        });

        it('should throw error for invalid presentation', async () => {
            prisma.presentation.findUnique.mockResolvedValue(null);
            await expect(createPerson({
                name: 'Test',
                role: 'Test',
                imageURL: 'test.jpg',
                details: 'Test',
                presentationId: 1
            })).rejects.toThrow('Presentation not found');
        });
    });

    describe('updatePerson', () => {
        it('should update a person and return all presenters sorted by name', async () => {
            prisma.presenter.findUnique.mockResolvedValue(mockPerson);
            prisma.presenter.update.mockResolvedValue({ ...mockPerson, name: 'Updated Name' });
            prisma.presenter.findMany.mockResolvedValue(mockPresenters);

            const result = await updatePerson('1', { name: 'Updated Name' });
            expect(result).toEqual(mockPresenters);
            expect(prisma.presenter.findMany).toHaveBeenCalledWith({
                orderBy: {
                    name: 'asc'
                }
            });
        });

        it('should throw error for non-existent person', async () => {
            prisma.presenter.findUnique.mockResolvedValue(null);
            await expect(updatePerson('1', { name: 'Test' })).rejects.toThrow('Person not found');
        });

        it('should update person with new presentation', async () => {
            prisma.presenter.findUnique.mockResolvedValue(mockPerson);
            prisma.presentation.findUnique.mockResolvedValue({ id: 2 });
            prisma.presenter.update.mockResolvedValue({
                ...mockPerson,
                presentations: [{ id: 2 }]
            });
            prisma.presenter.findMany.mockResolvedValue(mockPresenters);

            const result = await updatePerson('1', { presentationId: 2 });
            expect(result).toEqual(mockPresenters);
            expect(prisma.presenter.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining({
                    presentations: {
                        set: [{ id: 2 }]
                    }
                })
            });
        });
    });

    describe('deletePerson', () => {
        it('should delete a person', async () => {
            prisma.presenter.findUnique.mockResolvedValue(mockPerson);
            prisma.presenter.delete.mockResolvedValue(mockPerson);

            const result = await deletePerson('1');
            expect(result).toEqual({ success: true });
        });
    });
}); 