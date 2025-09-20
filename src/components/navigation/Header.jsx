import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { 
  FiMenu, FiBell, FiSearch, FiUser, 
  FiSettings, FiLogOut, FiHelpCircle 
} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/AuthSlicer'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Header({ setSidebarOpen }) {
   const user = useSelector((state) => state.auth.userInfo)
   const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
      <button
        type="button"
        className="md:hidden px-4 border-r border-neutral-200 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <FiMenu className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-2xl ">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative text-neutral-400 focus-within:text-neutral-600">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiSearch className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full bg-white py-2 pl-10 pr-3 border border-neutral-300 rounded-md leading-5 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className="bg-white p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="sr-only">View notifications</span>
            <FiBell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={"/logo.svg"}
                  alt=""
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#profile"
                      className={classNames(
                        active ? 'bg-neutral-100' : '',
                        'flex items-center px-4 py-2 text-sm text-neutral-700'
                      )}
                    >
                      <FiUser className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#settings"
                      onClick={() => navigate('/settings')}
                      className={classNames(
                        active ? 'bg-neutral-100' : '',
                        'flex items-center px-4 py-2 text-sm text-neutral-700'
                      )}
                    >
                      <FiSettings className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#help"
                      className={classNames(
                        active ? 'bg-neutral-100' : '',
                        'flex items-center px-4 py-2 text-sm text-neutral-700'
                      )}
                    >
                      <FiHelpCircle className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                      Help Center
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#logout"
                      onClick={handleLogout}
                      className={classNames(
                        active ? 'bg-neutral-100' : '',
                        'flex items-center px-4 py-2 text-sm text-neutral-700'
                      )}
                    >
                      <FiLogOut className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
}

export default Header