import './App.css'
import Menu from './app/components/screens/menu/Menu'
import MainLayout from './app/components/layouts/main/MainLayout'
import {
	BrowserRouter,
	Navigate,
	NavLink,
	Route,
	Routes
} from 'react-router-dom'
import ActiveOrders from './app/components/screens/active-orders/ActiveOrders'
import { initializeApp } from 'firebase/app';

function App() {
	const firebaseConfig = {
		apiKey: "AIzaSyCFoVx32Y-4p_Hmm-lpz8OnanFXLAsdtx4",
		authDomain: "alfa-canteen.firebaseapp.com",
		databaseURL: "https://alfa-canteen-default-rtdb.europe-west1.firebasedatabase.app",
		projectId: "alfa-canteen",
		storageBucket: "alfa-canteen.appspot.com",
		messagingSenderId: "621588455732",
		appId: "1:621588455732:web:49f86fdc0d0f414494c561",
		measurementId: "G-JHYS5G64WL"
	};

	const app = initializeApp(firebaseConfig);

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
					<Route path={'/menu'} element={<Menu  />} />
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
