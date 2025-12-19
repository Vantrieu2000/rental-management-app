import { setupCustomMatchers } from '../custom-matchers';

// Setup custom matchers
setupCustomMatchers();

describe('Custom Matchers', () => {
  describe('toBeValidRoomCode', () => {
    it('should pass for valid room codes', () => {
      expect('A101').toBeValidRoomCode();
      expect('ROOM123').toBeValidRoomCode();
      expect('ABC').toBeValidRoomCode();
    });

    it('should fail for invalid room codes', () => {
      expect(() => expect('ab').toBeValidRoomCode()).toThrow();
      expect(() => expect('A1').toBeValidRoomCode()).toThrow();
      expect(() => expect('TOOLONGCODE').toBeValidRoomCode()).toThrow();
    });
  });

  describe('toBeValidPhoneNumber', () => {
    it('should pass for valid Vietnamese phone numbers', () => {
      expect('0123456789').toBeValidPhoneNumber();
      expect('+84123456789').toBeValidPhoneNumber();
    });

    it('should fail for invalid phone numbers', () => {
      expect(() => expect('123456789').toBeValidPhoneNumber()).toThrow();
      expect(() => expect('012345678').toBeValidPhoneNumber()).toThrow();
    });
  });

  describe('toBeValidEmail', () => {
    it('should pass for valid emails', () => {
      expect('test@example.com').toBeValidEmail();
      expect('user.name@domain.co.uk').toBeValidEmail();
    });

    it('should fail for invalid emails', () => {
      expect(() => expect('invalid').toBeValidEmail()).toThrow();
      expect(() => expect('test@').toBeValidEmail()).toThrow();
    });
  });

  describe('toBePositiveAmount', () => {
    it('should pass for positive numbers', () => {
      expect(0).toBePositiveAmount();
      expect(100).toBePositiveAmount();
      expect(1000000).toBePositiveAmount();
    });

    it('should fail for negative numbers', () => {
      expect(() => expect(-1).toBePositiveAmount()).toThrow();
      expect(() => expect(NaN).toBePositiveAmount()).toThrow();
      expect(() => expect(Infinity).toBePositiveAmount()).toThrow();
    });
  });

  describe('toBeValidDate', () => {
    it('should pass for valid dates', () => {
      expect(new Date()).toBeValidDate();
      expect(new Date('2024-01-01')).toBeValidDate();
    });

    it('should fail for invalid dates', () => {
      expect(() => expect(new Date('invalid')).toBeValidDate()).toThrow();
      expect(() => expect('2024-01-01').toBeValidDate()).toThrow();
      expect(() => expect(null).toBeValidDate()).toThrow();
    });
  });
});
