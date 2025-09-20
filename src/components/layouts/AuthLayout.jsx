import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/logo.svg" alt="Bindu Jewellrey" className="h-12 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Bindu Jewellrey Admin
        </h2>
      </div>

      <div className="mt-3 lg:mt-8 sm:mx-auto sm:w-full sm:max-w-md p-3">
        <div className="bg-white py-8 px-4 shadow rounded sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout