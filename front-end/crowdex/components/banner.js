import Image from 'next/image'

export default function Banner () {
  return (
    // <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
    //   <div style={{ width: '30%', display: 'flex', flexDirection: 'column', color: 'black', justifyContent: 'center', alignItems: 'center'}}>
    //     <p>Gain early access and influence</p>
    //     <p>on your favorite artists NFTs</p>
    //   </div>
    //   
    // </div>
    <div class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div class="relative pt-6 px-4 sm:px-6 lg:px-8">
          </div>

          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Gain early access and influence with your</span>
                <span class="block text-indigo-600 xl:inline"> favorite NFT artists</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
              </p>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <Image
            src="/acastro_210329_1777_nft_0002.png"
            alt="Picture of the author"
            width={1000}
            height={700}
            layout="intrinsic"
          />
      </div>
    </div>
  )
}