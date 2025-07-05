import * as jose from 'jose'
export const secret = new TextEncoder().encode(process.env.AUTH_SECRET)

export interface ExtendedPayload extends jose.JWTPayload {
  userData: {
    slug: string
  }
}
