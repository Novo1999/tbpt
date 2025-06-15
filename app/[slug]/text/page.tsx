'use client'

import { isAuthAtom } from '@/app/[slug]/components/UserAccessModal'
import { useAtom } from 'jotai'

const TextPage = () => {
  const [isAuthenticated] = useAtom(isAuthAtom)
  console.log("🚀 ~ TextPage ~ isAuthenticated:", isAuthenticated)
  return <div>page</div>
}
export default TextPage
