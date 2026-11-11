import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'quiet'
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { to?: never; variant?: Variant }
type NavigationProps = LinkProps & { variant?: Variant }

export function AccessibleButton(props: ButtonProps | NavigationProps) {
  const { variant = 'primary', className = '', ...rest } = props
  const classes = `button button--${variant} ${className}`.trim()
  if ('to' in rest && rest.to !== undefined) return <Link {...rest as LinkProps} className={classes} />
  return <button type="button" {...rest as ButtonHTMLAttributes<HTMLButtonElement>} className={classes} />
}
