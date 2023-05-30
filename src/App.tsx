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
import { initializeApp } from 'firebase/app'
import LoginLayout from './app/components/layouts/login/LoginLayout'
import MyFamily from './app/components/screens/my-family/MyFamily'
import History from "./app/components/screens/history/History";
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datalist-input/dist/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import AllDishes from "./app/components/screens/all-dishes/AllDishes";
import Canteen from "./app/components/screens/canteen/Canteen";
import Teacher from "./app/components/screens/teacher/Teacher";


function App() {
	const firebaseConfig = {
		apiKey: 'AIzaSyCFoVx32Y-4p_Hmm-lpz8OnanFXLAsdtx4',
		authDomain: 'alfa-canteen.firebaseapp.com',
		databaseURL:
			'https://alfa-canteen-default-rtdb.europe-west1.firebasedatabase.app',
		projectId: 'alfa-canteen',
		storageBucket: 'alfa-canteen.appspot.com',
		messagingSenderId: '621588455732',
		appId: '1:621588455732:web:49f86fdc0d0f414494c561',
		measurementId: 'G-JHYS5G64WL'
	}

	const app = initializeApp(firebaseConfig)

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<LoginLayout />}>
					<Route path={'/login'} />
					<Route path={'*'} element={<Navigate to={'/login'} replace />} />
				</Route>
				<Route element={<MainLayout />}>
					<Route
						index
						path={'/'}
						element={<Navigate to={'/family'} replace />}
					/>
					<Route index path={'/menu'} element={<Menu />} />
					<Route path={'/profile'} element={<Menu />} />
					<Route path={'/canteen'} element={<Canteen />} />
					<Route path={'/teacher'} element={<Teacher />} />
					<Route path={'/dishes'} element={<AllDishes />} />
					<Route path={'/orders'} element={<ActiveOrders />} />
					<Route path={'/history'} element={<History />} />
					<Route path={'/family'} element={<MyFamily />} />
					<Route
						path={'*'}
						element={
							<div>
								Not Found<NavLink to={'/family'}>Home</NavLink>
							</div>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
