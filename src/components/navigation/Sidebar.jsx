import { NavLink } from 'react-router-dom'
import { 
  FiX, FiHome, FiPackage, FiShoppingBag, 
  FiTag, FiImage, FiUsers, FiSettings 
} from 'react-icons/fi'
import { TbTableOptions } from "react-icons/tb";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FiBookOpen,FiVideo } from "react-icons/fi";
import { useSelector } from 'react-redux'

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Users', href: '/users', icon: FiUsers },
  { name: 'Banners', href: '/banners', icon: FiImage },
  { name: 'Options', href: '/options', icon: FiPackage },
  { name: 'Variations', href: '/variations', icon: TbTableOptions },
  { name: 'Products', href: '/products', icon: MdProductionQuantityLimits },
  { name: 'Categories', href: '/categories', icon: FiTag },
  { name: 'Orders', href: '/orders', icon: FiShoppingBag },
  { name: 'Discounts', href: '/discounts', icon: FiTag },
 { name: 'Blog', href: '/blog', icon:  FiBookOpen },
  { name: 'Media', href: '/media', icon:  FiVideo },
  { name: 'Settings', href: '/settings', icon: FiSettings },
]

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const user = useSelector((state) => state.auth.userInfo)

  return (
    <div className="h-full flex flex-col border-r border-neutral-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex flex-col items-start flex-shrink-0 px-4">
          <img className="h-8 w-auto" src="/Bindu_logo.png" alt="Bindu Jewellrey" />
          <span className="mt-2 ml-2 text-lg font-semibold text-neutral-900">Admin Pannel</span>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'sidebar-link sidebar-link-active'
                  : 'sidebar-link sidebar-link-inactive'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-neutral-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full object-cover"
                src={"/dummy-profile-pic-300x300.jpg"}
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                {user?.name}
              </p>
              <p className="text-xs font-medium text-neutral-500 group-hover:text-neutral-700">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar