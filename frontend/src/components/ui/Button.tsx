
import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'danger'
  size?: 'sm' | 'md'
}

export default function Button({ variant = 'default', size = 'md', className, ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-xl transition-colors disabled:opacity-60 disabled:pointer-events-none'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm'
  }[size]
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800',
    danger: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
  }[variant]
  return <button className={clsx(base, sizes, variants, className)} {...rest} />
}
