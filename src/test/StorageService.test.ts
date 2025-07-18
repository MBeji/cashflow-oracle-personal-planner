import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('save', () => {
    it('should save data to localStorage', () => {
      const testData = { name: 'John', age: 30 };
      StorageService.save('test-key', testData);
      
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify(testData));
    });

    it('should handle primitive values', () => {
      StorageService.save('string-key', 'hello');
      StorageService.save('number-key', 42);
      StorageService.save('boolean-key', true);
      
      expect(localStorage.getItem('string-key')).toBe('"hello"');
      expect(localStorage.getItem('number-key')).toBe('42');
      expect(localStorage.getItem('boolean-key')).toBe('true');
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalSetItem = localStorage.setItem;
      
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });
      
      expect(() => StorageService.save('test', {})).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('load', () => {
    it('should load data from localStorage', () => {
      const testData = { name: 'John', age: 30 };
      localStorage.setItem('test-key', JSON.stringify(testData));
      
      const loaded = StorageService.load('test-key', {});
      expect(loaded).toEqual(testData);
    });

    it('should return default value when key does not exist', () => {
      const defaultValue = { default: true };
      const loaded = StorageService.load('non-existent-key', defaultValue);
      
      expect(loaded).toEqual(defaultValue);
    });

    it('should return default value when JSON is invalid', () => {
      localStorage.setItem('invalid-json', 'invalid json string');
      const defaultValue = { default: true };
      
      const loaded = StorageService.load('invalid-json', defaultValue);
      expect(loaded).toEqual(defaultValue);
    });

    it('should handle primitive default values', () => {
      expect(StorageService.load('missing-string', 'default')).toBe('default');
      expect(StorageService.load('missing-number', 42)).toBe(42);
      expect(StorageService.load('missing-boolean', false)).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove data from localStorage', () => {
      localStorage.setItem('test-key', 'test-value');
      expect(localStorage.getItem('test-key')).toBe('test-value');
      
      StorageService.remove('test-key');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should not throw error when removing non-existent key', () => {
      expect(() => StorageService.remove('non-existent')).not.toThrow();
    });
  });
});
