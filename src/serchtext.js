<section className="relative h-[100vh] w-full overflow-hidden">
{/* Background Image (bottom aligned) */}

<div className="absolute inset-0 z-0 flex items-end">
  <img
    src="/home-hero-desktop-hd.svg"
    alt={t.site.name}
    className="hidden h-auto w-full object-cover lg:block"
  />

  <img
    src="/home-hero-mobile-hd.svg"
    alt={t.site.name}
    className="h-auto w-full object-cover lg:hidden"
  />
</div>

{/* Foreground Content (top aligned) */}

<div className="relative z-10 flex w-full justify-center px-4 lg:mt-20">
  <div className="w-full max-w-2xl text-center">
    <div className="hidden lg:block">
      <h1 className="mb-3 text-2xl font-semibold text-black md:text-3xl lg:text-4xl">
        {t.home.bannerTitle}
      </h1>

      <p className="text-primary-800 text-sm md:text-base">
        {t.home.bannerSubTitle}
      </p>
    </div>

    <div className="rounded-2xl bg-white sm:p-6">
      <FilterComponent t={t} isRTL={isRTL} />
    </div>
  </div>
</div>
</section>