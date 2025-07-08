import { ParsedText } from "./text"

export type User = {
  slug: string
  password: string
  id: number
  texts?: ParsedText[]
} | null

