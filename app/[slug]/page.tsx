import UserAccessModal from '@/app/[slug]/components/UserAccessModal'
import { PageProps } from '@/app/types/PageProps'
import prisma from '@/lib/prisma'

const UserSlugPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const user = await prisma.user.findUnique({
    where: { slug },
  })

  return (
    <div>
      <UserAccessModal user={user} />
    </div>
  )
}
export default UserSlugPage
