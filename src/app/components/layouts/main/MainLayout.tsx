import styles from './MainLayout.module.scss'
import { useState } from 'react'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'

function MainLayout(): JSX.Element {
	const [pageTitle, setPageTitle] = useState('Меню')

	return (
		<>
			<nav className={styles['navigation-wrapper']}>
				<ul className={styles.navigation}>
					<NavLink className={({isActive}) => isActive ? styles.active : ''} to={'/family'}>Моя семья</NavLink>
					<NavLink className={({isActive}) => isActive ? styles.active : ''} to={'/menu'}>Меню</NavLink>
					<NavLink className={({isActive}) => isActive ? styles.active : ''} to={'/orders'}>Заявки</NavLink>
					<NavLink className={({isActive}) => isActive ? styles.active : ''} to={'/history'}>История</NavLink>
					<NavLink className={({isActive}) => isActive ? styles.active : ''} to={'/profile'}>Профиль</NavLink>
				</ul>
			</nav>
			<h1 className={styles.header}>{pageTitle}</h1>
			<main className={styles.container}><Outlet context={setPageTitle} /></main>
		</>
	)
}

export default MainLayout

export function usePageTitle() {
	return useOutletContext();
}