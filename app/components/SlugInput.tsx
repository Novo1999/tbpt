'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SlugInput = () => {
  const [value, setValue] = useState('')
  const { push } = useRouter()
  return (
    <div className="flex justify-between gap-2">
      <Input onChange={(e) => setValue(e.target.value)} value={value} type="text" placeholder="Username" className="w-full max-w-sm" />
      <Button disabled={!value} onClick={() => push(value)} className="cursor-pointer">
        Go <ArrowRight />{' '}
      </Button>
    </div>
  )
}
export default SlugInput
