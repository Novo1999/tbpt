import { RawText } from "./text"

export type User = {
  slug: string
  password: string
  id: number
  texts?: RawText[]
} | null

