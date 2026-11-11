type BrandSize = 'small' | 'medium' | 'large'
type BrandContext = 'header' | 'home' | 'footer' | 'institutional'
type BrandVariant = 'principal' | 'transparente'

type BrandLogoProps = {
  size?: BrandSize
  variant?: BrandVariant
  context: BrandContext
} & ({ decorative: true; alt?: never } | { decorative?: false; alt?: string })

const assets = {
  principal: { src: '/brand/logo-trilhas60-principal.png', width: 460, height: 247 },
  transparente: { src: '/brand/logo-trilhas60-transparente.png', width: 489, height: 280 },
} as const

/** Exibe os arquivos oficiais integralmente, sem filtros, recorte ou recriação. */
export function BrandLogo({ size = 'medium', variant = 'principal', context, decorative = false, alt }: BrandLogoProps) {
  const asset = assets[variant]
  return <span className={`brand-logo brand-logo--${size} brand-logo--${context}`}>
    <img
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={decorative ? '' : alt ?? 'Trilhas 60+. CONEXÃO • APRENDIZAGEM • AUTONOMIA'}
      aria-hidden={decorative ? true : undefined}
      decoding="async"
    />
  </span>
}
