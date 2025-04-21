const { prisma } = require('../testSetup.cjs');
const { getPeople } = require('../people.cjs');
const { createPerson, updatePerson, deletePerson } = require('../protected/people.cjs');
const { HttpError } = require('../errors.cjs');

describe('People Module', () => {
    const mockPerson = {
        id: 1,
        name: 'Test Person',
        role: 'Test Role',
        imageURL: 'test.jpg',
        details: 'Test Details',
        presentationId: 1
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPeople', () => {
        it('should return all people', async () => {
            prisma.presenter.findMany.mockResolvedValue([mockPerson]);

            const result = await getPeople();
            expect(result).toHaveLength(1);
        });
    });

    describe('Protected People Endpoints', () => {
        describe('createPerson', () => {
            it('should create a new person', async () => {
                prisma.presentation.findUnique.mockResolvedValue({ id: 1 });
                prisma.presenter.create.mockResolvedValue(mockPerson);

                const result = await createPerson({
                    name: 'Test Person',
                    role: 'Test Role',
                    imageURL: 'test.jpg',
                    details: 'Test Details',
                    presentationId: 1
                });
                expect(result).toEqual(mockPerson);
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
            it('should update a person', async () => {
                prisma.presenter.findUnique.mockResolvedValue(mockPerson);
                prisma.presenter.update.mockResolvedValue({ ...mockPerson, name: 'Updated Name' });

                const result = await updatePerson('1', { name: 'Updated Name' });
                expect(result.name).toBe('Updated Name');
            });

            it('should throw error for non-existent person', async () => {
                prisma.presenter.findUnique.mockResolvedValue(null);
                await expect(updatePerson('1', { name: 'Test' })).rejects.toThrow('Person not found');
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
}); 