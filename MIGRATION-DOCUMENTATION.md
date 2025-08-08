# Material UI to Shadcn UI Migration Documentation

## Overview

This document details the migration from Material UI to Shadcn UI in the FamilyChores-frontend project. The migration was performed to align with the project's desired UI framework and to resolve dependency conflicts that were causing build issues.

## Key Changes

1. **Removed Material UI Dependencies**
   - Removed all `@mui/*` and Material UI related packages from package.json
   - Replaced with Shadcn UI components which are built on Radix UI primitives

2. **Added Shadcn UI Components**
   - Added standard Shadcn UI components using their recommended approach
   - Components are now located in `app/components/ui/`
   - Each component is styled using Tailwind CSS

3. **Refactored Components**
   - Replaced Material UI components with Shadcn UI equivalents
   - Updated styling approaches to use Tailwind utility classes
   - Updated theme configuration to work with Tailwind

4. **Dialog/Modal Pattern**
   - Implemented modal dialogs using Shadcn UI's Dialog component
   - Created `ChoreFormModal.tsx` to replace the panel-based form with a modal dialog

5. **Updated Theme System**
   - Replaced Material UI theme provider with Tailwind theme configuration
   - Updated `src/theme.ts` to provide theme constants that work with Tailwind CSS
   - Aligned color scheme and design tokens with the existing palette

6. **Fixed TypeScript Integration**
   - Ensured proper type definitions for all components
   - Added types for the chore category field in relevant interfaces

## Specific Implementations

### ChoreFormModal

Created a new `ChoreFormModal` component that:
- Uses Shadcn UI's Dialog component for the modal interface
- Reuses form fields from the original ChoreForm component
- Supports both creating new chores and editing existing ones
- Includes category field for better organization

### Category Support

- Added `category` field to the `Chore` interface
- Updated DTO interfaces to include the category field
- Implemented display of chores grouped by category in the UI

### Mock Data Store

- Implemented an in-memory store in the chore service
- Added functionality to import chores from Chores.md with categories
- Ensured CRUD operations update the in-memory store

## Benefits

1. **Consistent UI**: All components now use the same UI framework (Shadcn UI)
2. **Dependency Resolution**: Fixed npm dependency conflicts with React versions
3. **Better Developer Experience**: Direct component customization instead of theme overrides
4. **Improved UX**: Modal pattern for forms provides a better user experience
5. **Efficient Organization**: Categorization of chores improves content organization

## Known Issues & Future Improvements

1. **Schedule Builder**: The Schedule Builder component may need additional refactoring
2. **Type Definitions**: Some TypeScript interfaces may need further refinement
3. **Animation Transitions**: Improve transitions between views and when opening/closing modals
4. **Performance Optimization**: Consider optimizing components for better rendering performance

## Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Conclusion

The migration from Material UI to Shadcn UI successfully resolved dependency conflicts and aligned the project with the intended UI framework. The resulting code is more maintainable, consistent, and provides a better user experience with features like modal dialogs and categorized content organization.
