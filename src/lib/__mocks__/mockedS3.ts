
jest.mock('../s3', () => ({
  __esModule: true,
  generateUploadUrl: jest.fn(() => Promise.resolve('https://mockedurl.com/signedurl')),
  deleteImage: jest.fn(() => Promise.resolve()),
}));