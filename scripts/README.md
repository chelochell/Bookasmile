# Scripts

This folder contains utility scripts for the Bookasmile application.

## User Seeder

The `seed-users.ts` script creates test users for each role in the system.

### Usage

```bash
# Install dependencies (if not already installed)
npm install

# Run the seeder
npm run seed
```

### What it does

The seeder creates one user for each role:
- **Patient**: `patient+<n>@test.com`
- **Dentist**: `dentist+<n>@test.com` 
- **Secretary**: `secretary+<n>@test.com`
- **Super Admin**: `super_admin+<n>@test.com`

### Features

- **Retry Logic**: If a user already exists, it tries the next number (up to 5 attempts)
- **Error Handling**: Shows clear error messages for failed attempts
- **Detailed Logging**: Displays all created users with their credentials
- **Consistent Password**: All users use the password `Admin123!`

### Sample Output

```
🌱 Starting user seeding process...
📝 Using password: Admin123!
──────────────────────────────────────────────────

Creating patient user: patient+1@test.com (attempt 1/5)
✅ Successfully created patient: patient+1@test.com

Creating dentist user: dentist+1@test.com (attempt 1/5)
✅ Successfully created dentist: dentist+1@test.com

──────────────────────────────────────────────────
📊 SEEDING SUMMARY
──────────────────────────────────────────────────
✅ Successfully created 4/4 users

👥 CREATED USERS:
──────────────────────────────
1. PATIENT
   📧 Email: patient+1@test.com
   👤 Name: John Patient
   🔑 Password: Admin123!

2. DENTIST
   📧 Email: dentist+1@test.com
   👤 Name: Dr. Smith
   🔑 Password: Admin123!

...
```

### Notes

- Users are created using the admin API
- Make sure your database is running before executing
- The script will automatically increment email numbers if users already exist
- All passwords are the same: `Admin123!` 