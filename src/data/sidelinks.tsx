import { UserRole } from '@/interfaces/auth.interface'
import {
  IconDatabaseExport,
  IconUserHexagon,
  IconUsersGroup,
  IconReportSearch

} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
  roles?: string[]
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Product',
    label: '',
    href: '/product',
    icon: <IconUsersGroup size={18} />,
    sub: [
      {
        title: 'Detail',
        label: '',
        href: '/product/detail',
        icon: <IconReportSearch size={18} />,
      },
      {
        title: 'Transaction',
        label: '',
        href: '/product/transaction',
        icon: <IconDatabaseExport size={18} />,
      },
    ],
  },
  {
    title: 'User',
    label: '',
    roles: [UserRole.SYSTEMADMIN, UserRole.SUPERADMIN],
    href: '/user',
    icon: <IconUserHexagon size={18} />,
  },
]
