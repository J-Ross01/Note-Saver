const express = require('express');
const path = require('path');

jest.mock('express', () => {
  return {
    __esModule: true, 
    default: jest.fn(() => ({ 
      use: jest.fn(),
      listen: jest.fn(),
    })),
    Router: () => ({ 
      get: jest.fn().mockImplementation((path, callback) => callback({}, { sendFile: jest.fn() })),
    }),
  };
});

describe('HTML Routes', () => {
  let app;
  let router;

  beforeEach(() => {
    jest.resetModules();
    app = express.default(); 
    router = require('./htmlRoutes');
    app.use(router); 
  });

  it('should route /notes to notes.html', () => {
    const mockSendFile = jest.fn();
    router.get.mock.calls.find(call => call[0] === '/notes')[1](null, { sendFile: mockSendFile });
    expect(mockSendFile).toHaveBeenCalledWith(path.join(__dirname, '..', 'public', 'notes.html'));
  });

  it('should route all other paths to index.html', () => {
    const mockSendFile = jest.fn();
    router.get.mock.calls.find(call => call[0] === '*')[1](null, { sendFile: mockSendFile });
    expect(mockSendFile).toHaveBeenCalledWith(path.join(__dirname, '..', 'public', 'index.html'));
  });
});