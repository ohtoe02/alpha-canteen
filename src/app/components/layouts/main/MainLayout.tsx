import styles from './MainLayout.module.scss'
import { useState } from 'react'
import {Navigate, NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import { useAuth } from '../../../../hooks/use-auth'
import { useDispatch } from 'react-redux'
import {removeUser, setUser} from '../../../store/slices/userSlice'
import {ToastContainer} from "react-toastify";

function MainLayout(): JSX.Element {
	const [pageTitle, setPageTitle] = useState('Меню')
	const { isAuth } = useAuth()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	if (!isAuth) return <Navigate to={'/login'} replace />

	const user = {
		login: localStorage.getItem('login'),
		school: localStorage.getItem('school'),
	}

	dispatch(setUser(user))

	return (
		<>
			<nav className={styles['navigation-wrapper']}>
				<ul className={styles.navigation}>
					<NavLink
						className={({ isActive }) => (isActive ? styles.active : '')}
						to={'/dishes'}
					>
						Все блюда
					</NavLink>
					<NavLink
						className={({ isActive }) => (isActive ? styles.active : '')}
						to={'/canteen'}
					>
						Столовая
					</NavLink>
					<NavLink
						className={({ isActive }) => (isActive ? styles.active : '')}
						to={'/teacher'}
					>
						Классы
					</NavLink>
					<NavLink
						className={({ isActive }) => (isActive ? styles.active : '')}
						to={'/family'}
					>
						Моя семья
					</NavLink>
					<NavLink
						className={({ isActive }) => (isActive ? styles.active : '')}
						to={'/menu'}
					>
						Меню
					</NavLink>
					{/*<NavLink*/}
					{/*	className={({ isActive }) => (isActive ? styles.active : '')}*/}
					{/*	to={'/orders'}*/}
					{/*>*/}
					{/*	Заявки*/}
					{/*</NavLink>*/}
					<NavLink
						className={({ isActive }) => (isActive ? styles.active : '')}
						to={'/history'}
					>
						История
					</NavLink>
					{/*<NavLink*/}
					{/*	className={({ isActive }) => (isActive ? styles.active : '')}*/}
					{/*	to={'/profile'}*/}
					{/*>*/}
					{/*	Профиль*/}
					{/*</NavLink>*/}
					<a style={{position: "absolute", right: '64px', cursor: "pointer"}}
						onClick={() => {
							dispatch(removeUser())
							navigate('/login')
						}}
					>
						Выйти
					</a>
				</ul>
			</nav>
			<h1 className={styles.header}>{pageTitle}</h1>
			<ToastContainer />
			<main className={styles.container}>
				<Outlet context={setPageTitle} />
			</main>
		</>
	)
}

export default MainLayout

export function usePageTitle() {
	return useOutletContext()
}
