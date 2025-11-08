# User Type Specific Dashboard Implementation

## Overview
This document outlines the implementation of user type-specific dashboard functionality that allows the system to show different content and features based on whether a user is a **contractor** or **homeowner/client**.

## User Flow

### Authentication & Redirect Flow
```
Sign Up/Login → /home (for all users) → Dashboard button → /dashboard (conditional content)
```

**All Users (Both Contractors & Homeowners):**
1. **Sign up/Login** → Everyone goes to `/home` first
2. **Home page** (`/home`) → Shows user-specific content based on user type
3. **Navbar "Dashboard"** → Routes to `/dashboard` (no navbar version) with conditional content

## Implementation Details

### 1. User Type Detection
The system uses the `user_type` field from the authentication context:
- **Contractors**: `user.user_type === 'contractor'`
- **Homeowners/Clients**: `user.user_type === 'homeowner'`

### 2. Modified Files

#### Authentication & Routing
- **`frontend/src/components/AuthForm.tsx`**: All users redirect to `/home` after signup/login
- **`frontend/src/app/(no-navbar)/login/page.tsx`**: Simplified redirect to `/home` for all users
- **`frontend/src/app/(no-navbar)/page.tsx`**: Main page redirects all logged-in users to `/home`
- **`frontend/middleware.ts`**: Auth routes redirect all users to `/home`

#### Navigation
- **`frontend/src/components/Navbar.tsx`**: 
  - Different navigation items based on user type
  - **Contractors**: Dashboard, Projects, Reviews
  - **Homeowners**: Home, Dashboard, Start Claim, Test
  - Logo always links to `/home` when logged in

#### Dashboard Content
- **`frontend/src/app/(no-navbar)/dashboard/page.tsx`**: 
  - Main dashboard with conditional sections
  - Shows different content based on `user.user_type`
  - Easy template structure for adding new user-specific features

#### Test Features
- **`frontend/src/app/(with-navbar)/test/page.tsx`**: Test page only visible to homeowners
- **`frontend/middleware.ts`**: Added `/test` to protected routes

### 3. Conditional Content Examples

#### Navbar Navigation
```jsx
// Contractor-specific navigation
{isLoggedIn && user?.user_type === "contractor" && (
  <Link href="/contractor-projects">Projects</Link>
)}

// Homeowner-specific navigation  
{isLoggedIn && user?.user_type === "homeowner" && (
  <Link href="/start-claim">Start Claim</Link>
)}
```

#### Dashboard Sidebar
```jsx
// Contractor-only section: My Reviews
{user?.user_type === "contractor" && (
  <Button onClick={() => setActiveSection('reviews')}>
    <Star className="w-3 h-3" />
    My Reviews
  </Button>
)}
```

#### Dashboard Main Content
```jsx
// Different buttons based on user type
{user?.user_type === 'contractor' ? (
  <Button onClick={() => router.push("/contractor-projects")}>
    Browse Projects
  </Button>
) : (
  <Button onClick={() => router.push("/start-claim")}>
    Start New Claim
  </Button>
)}
```

## Adding New User-Specific Features

### Template for Contractor-Only Features
```jsx
{user?.user_type === "contractor" && (
  <Button onClick={() => setActiveSection('new-contractor-feature')}>
    <Icon className="w-3 h-3" />
    {sidebarExpanded && "Contractor Feature"}
  </Button>
)}
```

### Template for Client-Only Features
```jsx
{user?.user_type === "homeowner" && (
  <Button onClick={() => setActiveSection('new-client-feature')}>
    <Icon className="w-3 h-3" />
    {sidebarExpanded && "Client Feature"}
  </Button>
)}
```

## Current User-Specific Features

### Contractors See:
- **Navigation**: Dashboard, Projects, Reviews
- **Dashboard Sections**: My Reviews (contractors only)
- **Main Button**: "Browse Projects"
- **No Access**: Test page

### Homeowners/Clients See:
- **Navigation**: Home, Dashboard, Start Claim, Test
- **Dashboard Sections**: Standard sections (no "My Reviews")
- **Main Button**: "Start New Claim"  
- **Access**: Test page for verification

## Database Schema
The system supports user types through:
- **Supabase user metadata**: `user.user_metadata.user_type`
- **Prisma schema**: `User.userType` field
- **Signup process**: Sets user type during account creation

## Protected Routes
All user-specific pages are protected in `middleware.ts`:
```javascript
const protectedRoutes = [
  '/dashboard',    // Main dashboard (both user types)
  '/home',         // Landing page (both user types)
  '/test',         // Homeowner-only test page
  // ... other protected routes
]
```

## Testing the Implementation

### Verify Contractor Flow:
1. Sign up using `/contractor-signup`
2. Should redirect to `/home`
3. Navbar should show: Dashboard, Projects, Reviews
4. Dashboard should show "My Reviews" section
5. Should NOT see "Test" tab

### Verify Homeowner Flow:
1. Sign up using `/signup`
2. Should redirect to `/home`
3. Navbar should show: Home, Dashboard, Start Claim, Test
4. Dashboard should NOT show "My Reviews" section
5. Should see "Test" tab and be able to access test page

## Future Enhancements
The system is now structured to easily add:
- **Contractor-specific dashboards**: Bid management, project history, earnings
- **Client-specific features**: Claim tracking, contractor browsing, reviews
- **Role-based permissions**: Different access levels within user types
- **Admin panels**: Management interfaces for different user types

## Technical Notes
- Uses React conditional rendering with `user?.user_type` checks
- All routing logic centralized in key files for easy maintenance
- Template comments provided throughout code for easy feature addition
- Maintains backward compatibility with existing features
