# Multi-Restaurant/Venue & Employee Management Implementation

## Overview
This implementation adds comprehensive support for managing multiple restaurants/venues with employee management and table-worker assignments as requested in the problem statement.

## Features Implemented

### ✅ 1. Multiple Restaurants/Venues
- Users can create and manage multiple restaurants
- Each restaurant can have its own floors, tables, and employees
- Full CRUD operations via API and UI
- Restaurant selector for easy switching between venues

### ✅ 2. Employee Management
- Create, read, update, and delete employees
- Assign employees to specific restaurants
- Track employee roles (waiter, chef, manager, host, bartender)
- Store contact information (email, phone)
- View which tables each employee is assigned to

### ✅ 3. Worker Assignment to Tables
- Assign employees to specific tables for tracking
- Optional field - tables don't require worker assignment
- View assigned worker in table details
- Update worker assignments at any time

## Quick Start

### Prerequisites
- Node.js installed
- PostgreSQL database
- Environment variables configured

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL in .env
npm run prisma:migrate
npm run dev
```

### Frontend Setup
```bash
npm install
npm run dev
```

## API Endpoints

### Employee Endpoints
- `GET /api/employees?restaurantId={id}` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Restaurant Endpoints
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants?id={id}` - Get specific restaurant
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Table Endpoints (Updated)
- Tables now support `workerId` field for worker assignment
- Worker information included in table responses

See `backend/API_DOCUMENTATION.md` for complete API documentation.

## UI Pages

### /employees
- View all employees for selected restaurant
- Create new employees with form validation
- Edit employee information
- Delete employees with confirmation
- See table assignments for each employee

### /settings
- Manage multiple restaurants
- Create/edit/delete restaurants
- View restaurant statistics (floors, employees)
- Switch between restaurants

### Dashboard & Tables
- Worker assignment dropdown when creating tables
- Display assigned worker in table details
- Restaurant selector if user has multiple venues

## Database Schema

### Employee Model
```prisma
model Employee {
  id           Int      @id @default(autoincrement())
  restaurantId Int
  restaurant   Restaurant @relation(...)
  name         String
  email        String?
  phone        String?
  role         String   @default("waiter")
  tables       Table[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Table Model (Updated)
```prisma
model Table {
  // ... existing fields
  workerId     Int?
  worker       Employee? @relation(...)
}
```

### Restaurant Model (Updated)
```prisma
model Restaurant {
  // ... existing fields
  employees    Employee[]
  // No unique constraint on userId - allows multiple restaurants per user
}
```

## Security

### Implemented
- ✅ JWT authentication on all endpoints
- ✅ Authorization checks (users only access their resources)
- ✅ Input validation
- ✅ SQL injection protection (Prisma ORM)
- ✅ Proper cascade/null relationships

### Recommendations
- Consider adding rate limiting (see SECURITY_SUMMARY.md)
- Monitor API usage in production
- Regular security audits

## Testing

### Build Verification
```bash
# Frontend
npm run build

# Backend
cd backend
npm run prisma:generate
```

### Manual Testing
1. Create a restaurant in Settings
2. Add employees in Employees page
3. Create floor and tables in Dashboard
4. Assign workers to tables
5. Verify worker information displays correctly

## Architecture Decisions

### Backward Compatibility
- All new features are optional
- Existing functionality not affected
- Tables work with or without worker assignment

### Multi-Restaurant Support
- Removed one-restaurant-per-user limitation
- Restaurant selector appears when user has multiple venues
- Each restaurant maintains its own employees and tables

### Data Relationships
- Employee → Restaurant (many-to-one)
- Table → Employee (many-to-one, optional)
- On restaurant delete: All employees cascade delete
- On employee delete: Table workerId set to null

## Technology Stack

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT authentication

### Frontend
- React + TypeScript
- React Query (data fetching)
- Tailwind CSS (styling)
- Lucide React (icons)
- Shadcn/ui (components)

## File Structure

```
backend/
├── routes/
│   ├── employees.js          # NEW: Employee CRUD
│   ├── restaurants.js         # UPDATED: Multi-restaurant support
│   ├── tables.js             # UPDATED: Worker assignment
│   └── ...
├── prisma/
│   └── schema.prisma         # UPDATED: Employee model
└── API_DOCUMENTATION.md      # UPDATED: Complete API docs

src/
├── pages/
│   ├── Employees.tsx         # NEW: Employee management
│   ├── Settings.tsx          # UPDATED: Multi-restaurant management
│   └── ...
├── hooks/
│   ├── useEmployees.ts       # NEW: Employee API hooks
│   ├── useRestaurants.ts     # UPDATED: Multi-restaurant hooks
│   └── ...
├── components/
│   ├── add-table-dialog.tsx  # UPDATED: Worker assignment
│   ├── reservation-panel.tsx # UPDATED: Worker display
│   └── ...
└── lib/
    └── api.ts                # UPDATED: Employee types

SECURITY_SUMMARY.md           # NEW: Security analysis
```

## Future Enhancements

### Potential Improvements
- [ ] Rate limiting middleware
- [ ] Employee schedules and shifts
- [ ] Performance analytics per worker
- [ ] Multi-location support per restaurant
- [ ] Employee permissions and roles
- [ ] Table section management
- [ ] Tips and sales tracking

### Known Limitations
- Rate limiting not implemented (consistent with existing codebase)
- No employee authentication (they're managed by restaurant owners)
- No shift/schedule management

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md for endpoint details
2. Review SECURITY_SUMMARY.md for security information
3. Refer to Prisma schema for data model
4. Check console logs for debugging

## Contributors

Implementation by GitHub Copilot Workspace Agent
Co-authored-by: AliAmzai <112178171+AliAmzai@users.noreply.github.com>

## License

Same as parent project
