/**
 * Authentication-related constants
 */

// Account roles
export const USER_ROLES = {
  PARENT: "PARENT",
  CHILD: "CHILD",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Form validation constants
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const NOTES_MAX_LENGTH = 1000;
export const CHILDREN_MAX_COUNT = 20;

// Image upload constants
export const ID_IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const ID_IMAGE_QUALITY = 0.8;
export const ID_IMAGE_ASPECT_RATIO = [4, 3] as const;
