const request = require('supertest');
const express = require('express');
const apiRoutes = require('./apiRoutes');
const fs = require('fs').promises;

jest.mock('fs', () => ({
    promises: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
    },
  }));

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

    describe('POST /notes', () => {
        it('should create a note then retun it', async () => {
            const newNotes = {title: 'Test POST', text: 'This is a test note for POST' };
            const mockNotes = [];

            fs.readFile.mockResolvedValue(JSON.stringify(mockNotes));
            fs.writeFile.mockResolvedValue();
            
            const response = await request(app)
            .post('/api/notes')
            .send(newNotes);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newNotes.title);
            expect(response.body.text).toBe(newNotes.text);

            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                expect.stringContaining(newNotes.title),
                'utf8'
            );
        });

    });
});