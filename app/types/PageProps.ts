type Params = Promise<{ slug: string; id?: string }>
type SearchParams = Promise<{ [key: string]: string | undefined }>

export type PageProps = {
  params: Params
  searchParams?: SearchParams
}
