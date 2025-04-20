// Mock state for testing
export const mockState = {
    questions: [],
    presentations: []
};

export async function getQuestions(presentationId) {
    if (!presentationId) {
        throw new Error('Presentation ID is required');
    }

    if (isNaN(Number(presentationId))) {
        throw new Error('Invalid presentation ID');
    }

    const presentation = mockState.presentations.find(p => p.id === Number(presentationId));
    if (!presentation) {
        throw new Error('Presentation not found');
    }

    return mockState.questions.filter(q => q.presentationId === Number(presentationId));
}

export async function createQuestion(presentationId, content, author, authorToken) {
    if (!content) {
        throw new Error('Content is required');
    }

    const presentation = mockState.presentations.find(p => p.id === Number(presentationId));
    if (!presentation) {
        throw new Error('Presentation not found');
    }

    const newQuestion = {
        id: mockState.questions.length + 1,
        content,
        author,
        authorToken,
        presentationId: Number(presentationId),
        likes: 0
    };

    mockState.questions.push(newQuestion);
    return [newQuestion];
}

export async function likeQuestion(questionId) {
    if (!questionId) {
        throw new Error('Question ID is required');
    }

    const question = mockState.questions.find(q => q.id === Number(questionId));
    if (!question) {
        throw new Error('Question not found');
    }

    question.likes += 1;
    return [question];
}

export async function unlikeQuestion(questionId) {
    if (!questionId) {
        throw new Error('Question ID is required');
    }

    const question = mockState.questions.find(q => q.id === Number(questionId));
    if (!question) {
        throw new Error('Question not found');
    }

    if (question.likes > 0) {
        question.likes -= 1;
    }
    return [question];
}

export async function deleteQuestion(questionId, authorToken) {
    if (!authorToken) {
        throw new Error('Author token is required');
    }

    const question = mockState.questions.find(q => q.id === Number(questionId));
    if (!question) {
        throw new Error('Question not found');
    }

    if (question.authorToken !== authorToken) {
        throw new Error('Not authorized to delete this question');
    }

    mockState.questions = mockState.questions.filter(q => q.id !== Number(questionId));
    return mockState.questions;
}

// For testing purposes
export function resetMockState() {
    mockState = {
        questions: [],
        presentations: []
    };
}

export function setMockState(newState) {
    mockState = newState;
}

export function getMockState() {
    return mockState;
} 