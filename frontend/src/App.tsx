import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileStickyBar from './components/MobileStickyBar';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Menu from './pages/Menu';
import AboutUs from './pages/AboutUs';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Root route renders nothing but an Outlet so child layout routes can opt in/out of chrome
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Pathless layout route that wraps the main public site with Header/Footer/etc.
const siteLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'siteLayout',
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileStickyBar />
      <WhatsAppButton />
    </div>
  ),
});

const homeRoute = createRoute({ getParentRoute: () => siteLayoutRoute, path: '/', component: Home });
const menuRoute = createRoute({ getParentRoute: () => siteLayoutRoute, path: '/menu', component: Menu });
const aboutRoute = createRoute({ getParentRoute: () => siteLayoutRoute, path: '/about', component: AboutUs });
const reviewsRoute = createRoute({ getParentRoute: () => siteLayoutRoute, path: '/reviews', component: Reviews });
const contactRoute = createRoute({ getParentRoute: () => siteLayoutRoute, path: '/contact', component: Contact });

// Admin route is a direct child of root — no site header/footer
// URL is intentionally obscure to reduce visibility
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pindpahadi-manage-2024',
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  siteLayoutRoute.addChildren([homeRoute, menuRoute, aboutRoute, reviewsRoute, contactRoute]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
