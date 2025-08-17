import React from 'react'
import { Button } from '../ui/button'
import { Plus, Calendar, ScanHeart } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <p className='font-bold text-md'>Quick Actions</p>
      </div>

      <div className='flex flex-col gap-6'>
        <Button ><span><Plus/></span>Book Appointment</Button>
        <div className='flex gap-2'>
          <Calendar size={16} color='#4f617b'/> 
          <p className='text-xs text-[#4f617b]'>View History</p>

        </div>
         <div className='flex gap-2'>
          <ScanHeart size={16} color='#4f617b'/> 
          <p className='text-xs text-[#4f617b]'>Medical Records</p>
        </div>

      </div>
    </div>
  )
}
