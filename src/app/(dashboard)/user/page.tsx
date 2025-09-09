import CardContent from '@/components/CardContent'
import TableContent from '@/components/TableContent'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col py-4 px-4 md:px-6 gap-4'>
      <div className='flex flex-col gap-4'>
      <p className='text-3xl text-[#0F1E7A] font-normal'>Summary</p>
      <CardContent />
      </div>
      <div className='flex justify-between items-center py-4'>
        <p className='text-md md:text-2xl text-[#0F1E7A] font-medium leading-5'>Request Submitted</p>
        <Link href="/requisition?new=true">
        <Button className='px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer'><Plus size={22} /> New Request</Button>
        </Link>
      </div>
      <TableContent />
    </div>
  )
}

export default page

