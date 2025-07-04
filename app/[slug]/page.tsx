import UserAccessModal from '@/app/[slug]/components/UserAccessModal'
import { PageProps } from '@/app/types/PageProps'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const UserSlugPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const user = await prisma.user.findUnique({
    where: { slug },
  })

  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  if (session) {
    redirect(slug + '/text')
  } else {
    return (
      <div>
        <UserAccessModal user={user} />
      </div>
    )
  }
}
export default UserSlugPage
