"use strict";
// Shared types for Family Chores application
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABILITY_LEVELS = exports.API_CONFIG = exports.FREQUENCY_OPTIONS = void 0;
// Frequency options
exports.FREQUENCY_OPTIONS = {
    DAILY: 'daily',
    WEEKDAYS_ONLY: 'weekdays_only',
    WEEKEND: 'weekend',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    TWICE_YEARLY: 'twice_yearly',
    ANNUALLY: 'annually',
    AD_HOC: 'ad_hoc',
    MULTIPLE_DAILY: 'multiple_daily'
};
// API Configuration
exports.API_CONFIG = {
    DEVELOPMENT: {
        BACKEND_PORT: 4001,
        FRONTEND_PORT: 4000
    },
    ENDPOINTS: {
        CHORES: '/api/chores',
        PEOPLE: '/api/people',
        TIMEZONES: '/api/timezones',
        ASSIGNMENTS: '/api/assignments',
        ABILITIES: '/api/abilities'
    }
};
// Ability levels
exports.ABILITY_LEVELS = {
    ALONE: 'alone',
    WITH_HELP: 'with_help',
    CANNOT_DO: 'cannot_do'
};
