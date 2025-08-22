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

function generateRandomThreeLetters(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  return result
}

async function createUser(userType: UserToCreate, randomCode: string): Promise<CreatedUser | null> {
  const email = `${userType.role}+${randomCode}@test.com`
  const name = GENERIC_NAMES[userType.role]
  
  try {
    console.log(`Creating ${userType.role} user: ${email}`)
    
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
      console.log(`❌ Failed to create ${userType.role}: ${result.error}`)
      return null
    }
  } catch (error: any) {
    console.log(`❌ Error creating ${userType.role}: ${error.message}`)
    return null
  }
}

async function createAllUsersWithCode(randomCode: string): Promise<CreatedUser[]> {
  console.log(`🎯 Using code: ${randomCode} for all users`)
  console.log('─'.repeat(30))
  
  const createdUsers: CreatedUser[] = []
  
  for (const userType of USERS_TO_CREATE) {
    const user = await createUser(userType, randomCode)
    if (user) {
      createdUsers.push(user)
    }
  }
  
  return createdUsers
}

async function seedUsers() {
  console.log('🌱 Starting user seeding process...')
  console.log(`📝 Using password: ${PASSWORD}`)
  console.log('─'.repeat(50))
  
  let createdUsers: CreatedUser[] = []
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const randomCode = generateRandomThreeLetters()
    console.log(`\n🔄 Attempt ${attempt}/${MAX_RETRIES}`)
    
    createdUsers = await createAllUsersWithCode(randomCode)
    
    // If all users were created successfully, break out of retry loop
    if (createdUsers.length === USERS_TO_CREATE.length) {
      break
    }
    
    // If some failed, try again with a new code
    if (createdUsers.length < USERS_TO_CREATE.length && attempt < MAX_RETRIES) {
      console.log(`\n⚠️  Only ${createdUsers.length}/${USERS_TO_CREATE.length} users created. Trying with new code...\n`)
      createdUsers = [] // Reset for next attempt
    }
  }
  
  console.log('\n' + '─'.repeat(50))
  console.log('📊 SEEDING SUMMARY')
  console.log('─'.repeat(50))
  
  if (createdUsers.length === 0) {
    console.log('❌ No users were created after all attempts')
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