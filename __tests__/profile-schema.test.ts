import { profileFormSchema } from '../src/lib/schemas/user-schema';

// Test the Zod schema used for profile validation
describe('Profile Form Schema', () => {
  it('should validate a complete valid profile', () => {
    const validProfile = {
      displayName: 'John Doe',
      username: 'johndoe123',
      bio: 'This is a test bio',
      photoURL: 'https://example.com/photo.jpg',
      dob: new Date('1990-01-01'),
      gender: 'male' as const,
    };

    const result = profileFormSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('should reject invalid username characters', () => {
    const invalidProfile = {
      displayName: 'John Doe',
      username: 'john-doe!@#', // Invalid characters
      bio: 'This is a test bio',
      dob: new Date('1990-01-01'),
      gender: 'male' as const,
    };

    const result = profileFormSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Username can only contain letters, numbers, and underscores');
    }
  });

  it('should reject underage users', () => {
    const underageProfile = {
      displayName: 'Young User',
      username: 'younguser',
      dob: new Date('2010-01-01'), // Too young
      gender: 'male' as const,
    };

    const result = profileFormSchema.safeParse(underageProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('You must be at least 18 years old');
    }
  });

  it('should accept optional fields as empty', () => {
    const minimalProfile = {
      displayName: 'John Doe',
      username: 'johndoe123',
      bio: '',
      photoURL: '',
      dob: new Date('1990-01-01'),
      gender: 'male' as const,
    };

    const result = profileFormSchema.safeParse(minimalProfile);
    expect(result.success).toBe(true);
  });
});
