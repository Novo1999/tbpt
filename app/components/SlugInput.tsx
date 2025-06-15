'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { atom, useAtom } from 'jotai'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const valueAtom = atom('')
const SlugInput = () => {
  const [value, setValue] = useAtom(valueAtom)

  const { push } = useRouter()
  return (
    <div className="flex justify-between gap-2">
      <Input onKeyDown={(e) => e.key === 'Enter' && push(value)} onChange={(e) => setValue(e.target.value)} value={value} type="text" placeholder="Username" className="w-full max-w-sm" />
      <Button disabled={!value} onClick={() => push(value)} className="cursor-pointer">
        Go <ArrowRight />{' '}
      </Button>
    </div>
  )
}
export default SlugInput
