import styles from './AllDishes.module.scss'
import { useEffect, useState } from 'react'
import { useCredentials } from '../../../../hooks/use-auth'
import { child, get, getDatabase, ref } from 'firebase/database'
import { usePageTitle } from '../../layouts/main/MainLayout'
import CompactDishCard from '../../ui/cards/compact-dish-card/CompactDishCard'
import EditDish from '../../ui/edit-dish/EditDish'
import AlphaButton from '../../ui/buttons/AlphaButton'
import {dishType} from "../../../utils/types/dishes/dishType";

const categories = ['Основное', '1', 'Второе', '2', 'Напитки']
const translateCategories: { [id: string]: string } = {
	Основное: 'mainDishes',
	Второе: 'secondaryDishes',
	Напитки: 'drinks'
}

function AllDishes({ dish }: {dish?: dishType}): JSX.Element {
	const [currentFilter, setCurrentFilter] = useState('Основное')
	const [chosenDish, setChosenDish] = useState(null)
	const [allDishes, setAllDishes] = useState<{ [id: string]: any[] }>({
		mainDishes: [],
		secondaryDishes: [],
		drinks: []
	})
	const [selectOption, setSelectOption] = useState('select')
	const setPageTitle: any = usePageTitle()
	const { school } = useCredentials()
	const database = getDatabase()

	useEffect(() => {
		document.title = 'Все блюда'
		setPageTitle('Все блюда')

		getDishes()
	}, [selectOption])

	const getDishes = async () => {
		try {
			const schoolDishes = (
				await get(child(ref(database), `schools/${school}/menu/dishes/`))
			).val()
			setAllDishes(schoolDishes)
			console.log(schoolDishes)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	const changeOption = (option: string) => {
		setSelectOption(option)
	}

	const chooseToEdit = (dish: any) => {
		setChosenDish(dish)
		console.log(dish)
		setSelectOption('edit')
	}

	const pageTitles: {[id: string]: string} = {
		'select': 'Добавить или редактировать',
		'add': 'Добавить блюдо',
		'edit': 'Редактировать блюдо',
	}

	return (
		<div className={styles.wrapper}>
			<section>
				<div className={styles.filters}>
					{categories.map((item, idx) => (
						<div
							key={item}
							className={`${
								idx % 2 === 0 ? styles.filter : styles['filter-divider']
							} ${currentFilter === item ? styles.active : ''}`}
							onClick={() => {
								if (!['1', '2'].find(val => val === item))
									setCurrentFilter(item)
							}}
						>
							{item}
						</div>
					))}
				</div>

				<div className={styles['dish-list']}>
					{Object.values(allDishes[translateCategories[currentFilter]]).map(
						item => (
							<CompactDishCard key={item['id']} dish={item} onClick={() => {chooseToEdit(item)}} />
						)
					)}
				</div>
			</section>
			<div className={styles.divider}></div>
			<section>
				<h3 style={{ marginBottom: '32px' }}>{pageTitles[selectOption]}</h3>
				<EditDish changeOptionHandler={changeOption} dish={chosenDish} type={selectOption} />
				{selectOption !== 'select' ? (
					<div style={{ marginTop: 'auto', marginBottom: '32px' }}>
						<AlphaButton
							type={'dark-submit'}
							clickHandler={() => changeOption('select')}
						>
							Назад
						</AlphaButton>
					</div>
				) : (
					''
				)}
			</section>
		</div>
	)
}

export default AllDishes
