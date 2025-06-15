'use client'

import { createUser } from '@/app/[slug]/actions/create-user-action'
import { User } from '@/app/types/user'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { atom, useAtom } from 'jotai'
import { Loader } from 'lucide-react'
import { useActionState } from 'react'

type UserAccessModalProps = {
  user?: User | null
}

const openAtom = atom(true)
const userNameAtom = atom('')
const passwordAtom = atom('')

const initialState = {
  message: '',
  status: false,
  data: { slug: '', password: '', id: 0 },
}
const UserAccessModal = ({ user }: UserAccessModalProps) => {
  const [open, setOpen] = useAtom(openAtom)
  const [username, setUsername] = useAtom(userNameAtom)
  const [password, setPassword] = useAtom(passwordAtom)
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Access your site' : 'Create your site'}</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="slug">Username</Label>
              <Input id="slug" name="slug" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          )}

          <div className="space-y-2 mt-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button disabled={pending} className="mt-6 w-full">
            {pending ? <Loader className="animate-spin" /> : user ? 'Access' : 'Create'}
          </Button>
        </form>
        <small className="text-red-500">{!state?.status && state?.message}</small>
      </DialogContent>
    </Dialog>
  )
}

export default UserAccessModal
