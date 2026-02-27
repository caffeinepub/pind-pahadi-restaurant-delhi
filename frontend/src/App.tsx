import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileStickyBar from './components/MobileStickyBar';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Menu from './pages/Menu';
import AboutUs from './pages/AboutUs';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileStickyBar />
      <WhatsAppButton />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const menuRoute = createRoute({ getParentRoute: () => rootRoute, path: '/menu', component: Menu });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutUs });
const reviewsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/reviews', component: Reviews });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: Contact });

const routeTree = rootRoute.addChildren([homeRoute, menuRoute, aboutRoute, reviewsRoute, contactRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
