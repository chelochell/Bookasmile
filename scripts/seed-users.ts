#!/usr/bin/env tsx

import { AdminService } from '../src/server/services/admin.service'

const PASSWORD = 'Admin123!'
const MAX_RETRIES = 5

interface UserToCreate {
  role: 'patient' | 'dentist' | 'secretary' | 'super_admin'
  namePrefix: string
}

const USERS_TO_CREATE: UserToCreate[] = [
  { role: 'patient', namePrefix: 'Patient' },
  { role: 'dentist', namePrefix: 'Dr.' },
  { role: 'secretary', namePrefix: 'Secretary' },
  { role: 'super_admin', namePrefix: 'Admin' },
]

const GENERIC_NAMES = {
  patient: 'John Patient',
  dentist: 'Dr. Smith',
  secretary: 'Jane Secretary',
  super_admin: 'Super Admin',
}

interface CreatedUser {
  email: string
  password: string
  name: string
  role: string
}

async function createUserWithRetries(userType: UserToCreate): Promise<CreatedUser | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const email = `${userType.role}+${attempt}@test.com`
    const name = GENERIC_NAMES[userType.role]
    
    try {
      console.log(`Creating ${userType.role} user: ${email} (attempt ${attempt}/${MAX_RETRIES})`)
      
      const result = await AdminService.createUser({
        email,
        password: PASSWORD,
        name,
        role: userType.role,
      })

      if (result.success) {
        console.log(`✅ Successfully created ${userType.role}: ${email}`)
        return {
          email,
          password: PASSWORD,
          name,
          role: userType.role,
        }
      } else {
        console.log(`❌ Failed to create ${userType.role} (attempt ${attempt}): ${result.error}`)
      }
    } catch (error: any) {
      console.log(`❌ Error creating ${userType.role} (attempt ${attempt}): ${error.message}`)
    }
  }
  
  console.log(`💥 Failed to create ${userType.role} after ${MAX_RETRIES} attempts`)
  return null
}

async function seedUsers() {
  console.log('🌱 Starting user seeding process...')
  console.log(`📝 Using password: ${PASSWORD}`)
  console.log('─'.repeat(50))
  
  const createdUsers: CreatedUser[] = []
  
  for (const userType of USERS_TO_CREATE) {
    const user = await createUserWithRetries(userType)
    if (user) {
      createdUsers.push(user)
    }
    console.log('') // Empty line for readability
  }
  
  console.log('─'.repeat(50))
  console.log('📊 SEEDING SUMMARY')
  console.log('─'.repeat(50))
  
  if (createdUsers.length === 0) {
    console.log('❌ No users were created')
    return
  }
  
  console.log(`✅ Successfully created ${createdUsers.length}/${USERS_TO_CREATE.length} users`)
  console.log('')
  console.log('👥 CREATED USERS:')
  console.log('─'.repeat(30))
  
  createdUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.role.toUpperCase()}`)
    console.log(`   📧 Email: ${user.email}`)
    console.log(`   👤 Name: ${user.name}`)
    console.log(`   🔑 Password: ${user.password}`)
    console.log('')
  })
  
  console.log('🎉 Seeding completed!')
}

// Run the seeder
seedUsers()
  .then(() => {
    console.log('✅ Seeder finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeder failed:', error)
    process.exit(1)
  }) 