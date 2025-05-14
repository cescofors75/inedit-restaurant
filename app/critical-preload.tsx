// Component to preload critical assets
export default function CriticalPreload() {
  return (
    <>
      {/* Preload critical images */}
      <link
        rel="preload"
        href="/images/slider1.jpg"
        as="image"
        type="image/jpeg"
      />
      
      {/* Preload logo */}
      <link
        rel="preload"
        href="/images/INeDIT_LOGO_Color.png"
        as="image"
        type="image/png"
      />
      
      {/* Preload critical fonts */}
      <link
        rel="preconnect" 
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect" 
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </>
  )
}

