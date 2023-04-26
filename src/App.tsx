import './App.css'
import Menu from './app/components/screens/menu/Menu'
import MainLayout from './app/components/layouts/main/MainLayout'
import {
	BrowserRouter,
	Navigate,
	NavLink,
	Outlet,
	Route,
	Routes
} from 'react-router-dom'
import ActiveOrders from './app/components/screens/active-orders/ActiveOrders'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={
						<MainLayout />
					}
				>
					<Route
						index
						path={'/'}
						element={<Navigate to={'/family'} replace />}
					/>
					<Route index path={'/family'} element={<Menu />} />
					<Route path={'/menu'} element={<Menu />} />
					<Route path={'/orders'} element={<ActiveOrders />} />
					<Route path={'/history'} element={<Menu />} />
					<Route path={'/profile'} element={<Menu />} />
				</Route>
				<Route
					path={'*'}
					element={
						<div>
							Not Found<NavLink to={'/family'}>Home</NavLink>
						</div>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
