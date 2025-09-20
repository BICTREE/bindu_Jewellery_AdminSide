import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiLock, FiMail } from 'react-icons/fi'
import axios from '../../api/axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/slices/AuthSlicer'
import { setAccessToken, setRefreshToken } from '../../redux/slices/TokenReducer'
import { loginUrl } from '../../utils/Endpoint'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const from = location.state?.from?.pathname || '/'

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await axios.post(loginUrl, { email, password });

    const success = response?.data?.success;

    if (success) {
      const data = response?.data?.data;
      dispatch(setUser(data.userInfo));
      dispatch(setAccessToken(data.accessToken));
      dispatch(setRefreshToken(data.refreshToken));
      navigate(from, { replace: true });
    } else {
      // optional: handle backend failure response
      console.error("Login failed:", response?.data?.message);
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    // You can also show a toast or set an error state here
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className=''>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-neutral-300 rounded-md p-2"
              placeholder="admin@tesuto.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-neutral-300 rounded-md p-2"
              placeholder="password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#reset-password" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Demo credentials</span>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-neutral-600">
          <p>Email: admin@tesuto.com</p>
          <p>Password: password</p>
        </div>
      </div> */}

    </div>
  )
}

export default Login