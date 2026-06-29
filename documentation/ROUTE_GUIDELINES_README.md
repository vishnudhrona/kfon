# Route Organization Guidelines

## Purpose

This document defines the route structure and import rules for
maintaining consistency and scalability in the application.

## Route Categories (All Routes must fall under these 3 categories)

### 1. Public Routes

-   Accessible without authentication.
-   Includes login, signup, forgot-password, landing pages.
-   Must be imported from:\
    `src/features/public/routes.jsx`

### 2. Employee Routes

-   Accessible to general employees after login.
-   Includes dashboard, attendance, tasks, profile.
-   Must be imported from:\
    `src/features/employee/routes.jsx`

### 3. Admin Routes

-   Accessible only to admins or super-admins.
-   Includes user management, role management, system settings.
-   Must be imported from:\
    `src/features/admin/routes.jsx`

------------------------------------------------------------------------

## Notes

-   All new routes must follow this folder and import structure.
-   Do not import routes from mixed or unrelated directories.
