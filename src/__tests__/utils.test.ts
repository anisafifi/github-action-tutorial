/**
 * Unit tests for utility functions
 */

import { add, subtract, multiply, divide, capitalizeString } from '../utils';

describe('Utility Functions', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add a positive and negative number', () => {
      expect(add(5, -3)).toBe(2);
    });

    it('should handle zero', () => {
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should subtract and return a negative number', () => {
      expect(subtract(3, 5)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(subtract(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should multiply with zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('should multiply a positive and negative number', () => {
      expect(multiply(3, -2)).toBe(-6);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should divide and return a decimal', () => {
      expect(divide(5, 2)).toBe(2.5);
    });

    it('should throw an error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });

  describe('capitalizeString', () => {
    it('should capitalize the first letter', () => {
      expect(capitalizeString('hello')).toBe('Hello');
    });

    it('should handle already capitalized string', () => {
      expect(capitalizeString('Hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalizeString('a')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(capitalizeString('')).toBe('');
    });

    it('should handle strings with numbers', () => {
      expect(capitalizeString('123abc')).toBe('123abc');
    });
  });
});
