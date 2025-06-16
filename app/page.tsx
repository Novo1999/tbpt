import SlugInput from '@/app/components/SlugInput'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">
        T<small className="text-lg">he</small> B<small className="text-lg">etter</small> P<small className="text-lg">rotected</small> T<small className="text-lg">ext</small>{' '}
      </h1>
      <p className="text-lg mb-6 text-muted-foreground">Go to your secret texts</p>
      <SlugInput />
    </main>
  )
}
