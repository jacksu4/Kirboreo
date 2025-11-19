import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (class name utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    });

    it('should handle undefined and null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
    });

    it('should merge Tailwind classes correctly', () => {
      // Should remove conflicting classes and keep the last one
      expect(cn('px-2 py-1', 'px-4')).toContain('px-4');
    });
  });
});

