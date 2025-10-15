import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'

// Layout components
import DashboardLayout from './components/layouts/DashboardLayout'
import AuthLayout from './components/layouts/AuthLayout'

// Auth pages
import Login from './pages/auth/Login'

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard'
import Products from './pages/products/Products'
import ProductForm from './pages/products/ProductForm'
import Categories from './pages/categories/Categories'
import CategoryForm from './pages/categories/CategoryForm'
import Orders from './pages/orders/Orders'
import OrderDetails from './pages/orders/OrderDetails'
import Discounts from './pages/discounts/Discounts'
import DiscountForm from './pages/discounts/DiscountForm'
import Banners from './pages/banners/Banners'
import BannerForm from './pages/banners/BannerForm'
import Users from './pages/users/Users'
import UserDetails from './pages/users/UserDetails'
import Settings from './pages/settings/Settings'
import AdminGuard from './guards/AdminGuard'
import AuthGuard from './guards/AuthGuard'
import Options from './pages/options/Options'
import OptionForm from './pages/options/OptionForm'
import Variations from './pages/variations/Variations'
import VariationForm from './pages/variations/VariationForm'


import Blog from "./pages/blog/BlogPage"
import BlogForm from "./pages/blog/BlogForm"

import MediaPage from "./pages/media/MediaPage"
import MediaForm from "./pages/media/MediaForm";
function App() {

  return (
    <BrowserRouter>

      <Routes>
        {/* Auth routes */}

        <Route element={<AuthGuard />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

        <Route
          element={
            <AdminGuard />
          }
        >
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:id" element={<CategoryForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="discounts/new" element={<DiscountForm />} />
            <Route path="discounts/:id" element={<DiscountForm />} />
            <Route path="banners" element={<Banners />} />
            <Route path="banners/new" element={<BannerForm />} />
            <Route path="banners/:id" element={<BannerForm />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="settings" element={<Settings />} />

            <Route path="options" element={<Options />} />
            <Route path="options/new" element={<OptionForm />} />
            <Route path="options/:id" element={<OptionForm />} />

            <Route path="variations" element={<Variations />} />
            <Route path="variations/new" element={<VariationForm />} />
            <Route path="variations/:id" element={<VariationForm />} />

           <Route path="blog" element={<Blog />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/:id" element={<BlogForm />} />    

        <Route path="media" element={<MediaPage />} />
        <Route path="media/new" element={<MediaForm />} />
        <Route path="media/:id" element={<MediaForm />} />



          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App