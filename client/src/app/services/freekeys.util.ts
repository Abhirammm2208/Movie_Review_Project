/**
 * Utility wrapper for freekeys functions
 * Provides debounce and other freekeys utilities without using require()
 */

export class FreekeysUtil {
  /**
   * Debounce function - delays execution until after wait time
   * @param func - Function to debounce
   * @param wait - Milliseconds to wait
   * @returns Debounced function
   */
  static debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        func(...args);
      };

      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function - ensures function runs at most once per time interval
   * @param func - Function to throttle
   * @param limit - Milliseconds between executions
   * @returns Throttled function
   */
  static throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns True if valid email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns Strength level (weak, fair, good, strong)
   */
  static validatePassword(password: string): 'weak' | 'fair' | 'good' | 'strong' {
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'fair';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
    return 'good';
  }

  /**
   * Sanitize string input
   * @param input - String to sanitize
   * @returns Sanitized string
   */
  static sanitize(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 255);
  }
}
