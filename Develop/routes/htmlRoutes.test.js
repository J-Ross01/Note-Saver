const express = require('express');
const path = require('path');

jest.mock('express', () => {
  const originalModule = jest.requireActual('express');
  return {
    ...originalModule,
    Router: () => ({
      get: jest.fn().mockImplementation((path, callback) => callback({}, { sendFile: jest.fn() })),
    }),
  };
});

describe('HTML Routes', () => {
  let router;

  beforeEach(() => {
    jest.resetModules(); 
    router = require('./htmlRoutes'); 
  });

  it('should route /notes to notes.html', () => {
    const mockSendFile = jest.fn();
    router.get.mock.calls[0][1](null, { sendFile: mockSendFile });
    expect(mockSendFile).toHaveBeenCalledWith(path.join(__dirname, '..', 'public', 'notes.html'));
  });

  it('should route all other paths to index.html', () => {
    const mockSendFile = jest.fn();
    router.get.mock.calls[1][1](null, { sendFile: mockSendFile });
    expect(mockSendFile).toHaveBeenCalledWith(path.join(__dirname, '..', 'public', 'index.html'));
  });
});
