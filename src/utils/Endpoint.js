const prodBaseUrl = "https://tessuto-server.vercel.app/api"
// const devBaseUrl = "http://localhost:8080/api"
const devBaseUrl = "https://bindu-jewellery-backend.vercel.app/api"

export const baseUrl = import.meta.env.VITE_APP_ENV === "production" ? prodBaseUrl : devBaseUrl

// export const baseUrl =  prodBaseUrl 

export const authUrl = `/auth`
export const loginUrl = `/auth/login`
export const regenerateUrl = `/auth/regenerate-token`
export const sendOtpUrl = `/auth/send-otp`
export const verifyOtpUrl = `/auth/verify-otp`
export const resetPasswordUrl = `/auth/reset-password`;

export const bannerUrl = `/banners`
export const categoryUrl = `/categories`
export const dashboardUrl = `/dashboard`
export const discountUrl = `/discounts`
export const enquiryUrl = `/enquiries`
export const orderUrl = `/orders`

export const productUrl = `/products`
export const variationUrl = `/products/variations`
export const optionUrl = `/products/options`

export const reviewUrl = `/reviews`
export const testimonialUrl = `/testimonials`
export const uploadUrl = `/uploads`

export const userUrl = `/users`
export const cartUrl = `/users/carts`
export const wishlistUrl = `/users/wishlists`
export const addressUrl = `/users/addresses`

export const settingsUrl = `/settings`
export const siteSettingsUrl = `/settings/site`

export const logisticsUrl = `/logistics`
export const shipCostsUrl = `/logistics/ship-costs`

export const GetAllBlogsApi = '/blogs/all';

export const BlogApi = '/blogs';

export const mediaUrl = '/media';

export const GetAllmediaUrl = '/media/all';

export const groupMediaUrl = '/media-groups';

export const GetAllGroupMediaUrl = '/media-groups/admin/all';


