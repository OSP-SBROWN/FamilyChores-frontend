export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    count?: number;
    error?: string;
}
export interface Person {
    id: string;
    name: string;
    dateOfBirth: string | null;
    colorCode: string;
    workloadWeighting: string;
    photoUrl: string | null;
    createdAt: string;
    updatedAt: string;
    creator?: {
        id: string;
        username: string;
        email: string;
    };
}
export interface Chore {
    id: string;
    name: string;
    description: string | null;
    frequency: string;
    estimatedMinutes: number | null;
    createdAt: string;
    updatedAt: string;
    timezones?: ChoreTimezone[];
    personAbilities?: ChorePersonAbility[];
    assignments?: ChoreAssignment[];
    _count?: {
        assignments: number;
    };
}
export interface ChoreTimezone {
    id: string;
    choreId: string;
    timezoneId: string;
    isRequired: boolean;
    timezone: Timezone;
}
export interface ChorePersonAbility {
    id: string;
    choreId: string;
    personId: string;
    abilityLevel: 'alone' | 'with_help' | 'cannot_do';
    person: Person;
}
export interface ChoreAssignment {
    id: string;
    choreId: string;
    assignedToId: string;
    helperId: string | null;
    scheduledDate: string;
    timezoneId: string;
    status: 'pending' | 'completed' | 'skipped' | 'deferred';
    completedAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    assignedTo: Person;
    helper?: Person;
    timezone: Timezone;
}
export interface Timezone {
    id: string;
    name: string;
    displayOrder: number;
    description: string | null;
    createdAt: string;
}
export declare const FREQUENCY_OPTIONS: {
    readonly DAILY: "daily";
    readonly WEEKDAYS_ONLY: "weekdays_only";
    readonly WEEKEND: "weekend";
    readonly WEEKLY: "weekly";
    readonly MONTHLY: "monthly";
    readonly QUARTERLY: "quarterly";
    readonly TWICE_YEARLY: "twice_yearly";
    readonly ANNUALLY: "annually";
    readonly AD_HOC: "ad_hoc";
    readonly MULTIPLE_DAILY: "multiple_daily";
};
export type FrequencyType = typeof FREQUENCY_OPTIONS[keyof typeof FREQUENCY_OPTIONS];
export declare const API_CONFIG: {
    readonly DEVELOPMENT: {
        readonly BACKEND_PORT: 4001;
        readonly FRONTEND_PORT: 4000;
    };
    readonly ENDPOINTS: {
        readonly CHORES: "/api/chores";
        readonly PEOPLE: "/api/people";
        readonly TIMEZONES: "/api/timezones";
        readonly ASSIGNMENTS: "/api/assignments";
        readonly ABILITIES: "/api/abilities";
    };
};
export declare const ABILITY_LEVELS: {
    readonly ALONE: "alone";
    readonly WITH_HELP: "with_help";
    readonly CANNOT_DO: "cannot_do";
};
export type AbilityLevel = typeof ABILITY_LEVELS[keyof typeof ABILITY_LEVELS];
