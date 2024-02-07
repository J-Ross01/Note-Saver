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
        jest.clearAllMocks();
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

    describe('DELETE /notes/:id', () => {
        it('should delete a note by id', async () => {
          const mockNotes = [
            { id: '1', title: 'Test Note 1', text: 'This is test note 1' },
            { id: '2', title: 'Test Note 2', text: 'This is test note 2' }
          ];
      
          fs.readFile.mockResolvedValue(JSON.stringify(mockNotes));
          fs.writeFile.mockResolvedValue();
      
          const response = await request(app)
          .delete('/api/notes/1');
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ message: 'Note deleted successfully' });
      
          const expectedData = [mockNotes[1]]; 
          const formattedData = JSON.stringify(expectedData, null, 2); 
          expect(fs.writeFile).toHaveBeenCalledWith(
            expect.any(String),
            formattedData, 
            'utf8'
          );
        });
      });
      
});