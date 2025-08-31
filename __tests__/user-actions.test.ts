import { updateUserProfile, updateUserInterests } from '../src/actions/user-actions';

// Mock Firebase
jest.mock('../src/lib/firebase/config', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn().mockResolvedValue({}),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
  Timestamp: {
    now: jest.fn().mockReturnValue(new Date()),
    fromDate: jest.fn().mockImplementation((date) => date),
  },
}));

describe('User Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserProfile', () => {
    it('should validate and update user profile with valid data', async () => {
      const validData = {
        displayName: 'Test User',
        username: 'testuser',
        bio: 'Test bio',
        photoURL: '',
        dob: new Date('1990-01-01'),
        gender: 'male' as const,
      };

      const result = await updateUserProfile('test-uid', validData);
      expect(result).toEqual({ success: true });
    });

    it('should throw error for duplicate username', async () => {
      const { getDocs } = require('firebase/firestore');
      getDocs.mockResolvedValueOnce({
        docs: [{ id: 'other-uid', data: () => ({ username: 'testuser' }) }]
      });

      const validData = {
        displayName: 'Test User',
        username: 'testuser',
        bio: 'Test bio',
        dob: new Date('1990-01-01'),
        gender: 'male' as const,
      };

      await expect(updateUserProfile('test-uid', validData)).rejects.toThrow('Username is already taken');
    });
  });

  describe('updateUserInterests', () => {
    it('should update user interests successfully', async () => {
      const result = await updateUserInterests('test-uid', ['sports', 'music']);
      expect(result).toEqual({ success: true });
    });

    it('should throw error for missing user ID', async () => {
      await expect(updateUserInterests('', ['sports'])).rejects.toThrow('User ID is required');
    });

    it('should throw error for invalid interests array', async () => {
      await expect(updateUserInterests('test-uid', 'not-an-array' as any)).rejects.toThrow('Interests must be an array');
    });
  });
});
