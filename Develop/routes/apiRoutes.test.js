const request = require('supertest');
const express = require('express');
const apiRoutes = require('./apiRoutes');
const fs = require('fs').promises;

jest.mock('fs', () => {
    return {
        promises: {
            readFile: jest.fn(),
            writefile: jest.fn(),
        },
    };
});

describe('API Routes', ()=> {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api', apiRoutes);
    });

    describe('GET /notes', () => {
        it('should return all the notes', async () => {
            const mockNotes = [{id: '1', title: 'Test GET', text: 'This is a test note' }];
            fs.readFile.mockResolvedValue(JSON.stringify(mockNotes));
            
            const response = await request(app).get('/api/notes');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(mockNotes);
        });

        it('should handle routing errors', async () => {
            fs.readFile.mockRejectedValue(new Error('Error processing file'));

            const response = await request(app).get('/api/notes');
            expect(response.statusCode).toBe(500);
        });
    });
});