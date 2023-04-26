import styles from './Menu.module.scss'
import dishesMock from '../../../utils/mock/dishes'
import DishList from '../../ui/cards/dish-list/DishList'
import { usePageTitle } from '../../layouts/main/MainLayout'
import { useEffect, useState } from 'react'
import { getDatabase, ref, get, child } from 'firebase/database'

// @ts-ignore
function Menu(): JSX.Element {
	const [schoolDishesCur, setSchoolDishesCur] = useState({
		drinks: [],
		mainDishes: [],
		secondaryDishes: []
	})
	const setPageTitle: any = usePageTitle()
	const database = getDatabase()

	useEffect(() => {
		document.title = 'Меню'
		setPageTitle('Меню')

		const getDishes = async () => {
			try {
				const schoolDishes = (
					await get(child(ref(database), 'schools/school1/menu/dishes/'))
				).val()
				setSchoolDishesCur(schoolDishes)

				console.log(schoolDishesCur)
			} catch (e) {
				console.log('Error on fetching', e)
			}
		}

		getDishes()
	}, [])

	// const schoolDishesRef = db.ref('schools/school1/menu/dishes/mainDishes/')

	const dishes = dishesMock

	return (
		<div className={`${styles.container}`}>
			<div className={styles['dish-container']}>
				<DishList
					dishes={Object.values(schoolDishesCur['mainDishes'])}
					title={'Основное блюдо'}
				/>
				<div className={styles.divider}></div>
				<DishList
					dishes={Object.values(schoolDishesCur['secondaryDishes'])}
					title={'Второе блюдо'}
				/>
				<div className={styles.divider}></div>
				<DishList
					dishes={Object.values(schoolDishesCur['drinks'])}
					title={'Напитки'}
				/>
			</div>
		</div>
	)
}

export default Menu
