import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-start">
          <Image
            src="/images/pixan-logo.svg"
            alt="Pixan Logo"
            width={163}
            height={47}
            priority
          />
        </div>
      </div>
    </div>
  )
}