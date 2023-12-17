import handler from '../s3';
import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth/next';
import { generateUploadUrl } from '@/s3';

// The use of recipe API requires a session, so we mock it
jest.mock('next-auth/next');

const mockedGetSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

// We mock the generateUploadUrl function
jest.mock('../../../s3');

const mockedGenerateUploadUrl = generateUploadUrl as jest.MockedFunction<
  typeof generateUploadUrl
>;

// We test the API without a session
describe('/api/s3 without session', () => {
  test('GET', async () => {
    // We mock the getSession function to return an empty object. We use this in the first test
    mockedGetSession.mockResolvedValue(null);
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Unauthorized' });
  });
});

describe('/api/s3', () => {
  // We connect to the database and clear the recipes table before each test
  beforeAll(async () => {
    // After the initial test, we mock the getSession function to return a session object
    mockedGetSession.mockResolvedValue({
      expires: '1',
      user: {
        email: 'test@example.com',
        name: 'Test User',
        image: 'test-image',
      },
    });
    // We mock the generateUploadUrl function to return a URL
    mockedGenerateUploadUrl.mockResolvedValue('https://test-url');
  });

  test('GET', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).url).toBeDefined();
    // We check that the url is a string and that it contains the string 'https://'
    expect(typeof JSON.parse(res._getData()).url).toBe('string');
    expect(JSON.parse(res._getData()).url).toContain('https://');
  });
});
