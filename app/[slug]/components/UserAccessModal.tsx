'use client'

import { accessSite } from '@/app/[slug]/actions/access-site-action'
import { createUser } from '@/app/[slug]/actions/create-user-action'
import { User } from '@/app/types/user'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { atom, useAtom } from 'jotai'
import { Loader } from 'lucide-react'
import { redirect, useParams } from 'next/navigation'
import { useActionState, useEffect } from 'react'

type UserAccessModalProps = {
  user?: User | null
}

const openAtom = atom(true)
const slugAtom = atom('')
const passwordAtom = atom('')

export const isAuthAtom = atom(false)

const initialState = {
  message: '',
  status: false,
  data: { slug: '', password: '', id: 0 },
}
const initialStateForAccess = {
  status: false,
  message: '',
}
const UserAccessModal = ({ user }: UserAccessModalProps) => {
  const { slug } = useParams()
  const [open, setOpen] = useAtom(openAtom)
  const [slugVal, setSlugVal] = useAtom(slugAtom)
  const [password, setPassword] = useAtom(passwordAtom)
  const [, setIsAuthenticated] = useAtom(isAuthAtom)
  const [state, formAction, pending] = useActionState(createUser, initialState)
  const [stateForAccess, formActionForAccess, pendingForAccess] = useActionState(accessSite, initialStateForAccess)

  useEffect(() => setSlugVal(slug as string), [slug, setSlugVal])
  
  useEffect(() => {
    if (!user ? !!state.status : !!stateForAccess.status) {
      setIsAuthenticated(true)
      redirect((!user ? state?.data?.slug : slug) + '/text')
    }
  }, [state, user, setIsAuthenticated, stateForAccess, slug])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="sm:max-w-[400px] [&>button]:hidden"
      >
        <DialogHeader>
          <DialogTitle>{user ? 'Access your site' : 'Create your site'}</DialogTitle>
        </DialogHeader>
        <form action={user ? formActionForAccess : formAction}>
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="Enter slug" value={slugVal} onChange={(e) => setSlugVal(e.target.value)} />
            </div>
          )}

          {user && <input hidden value={slug} name="slug" />}

          <div className="space-y-2 mt-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button disabled={pending || !password || !slugVal} className="mt-6 w-full">
            {(user ? pendingForAccess : pending) ? <Loader className="animate-spin" /> : user ? 'Access' : 'Create'}
          </Button>
        </form>
        <small className="text-red-500">{(user ? stateForAccess?.status : !state?.status) && (user ? stateForAccess?.message : !state?.message)}</small>
      </DialogContent>
    </Dialog>
  )
}

export default UserAccessModal
