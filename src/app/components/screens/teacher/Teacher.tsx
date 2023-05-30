import styles from './Teacher.module.scss'
import { useEffect, useState } from 'react'
import { useCredentials } from '../../../../hooks/use-auth'
import { child, get, getDatabase, ref } from 'firebase/database'
import { usePageTitle } from '../../layouts/main/MainLayout'
import AlphaButton from '../../ui/buttons/AlphaButton'
import { dishType } from '../../../utils/types/dishes/dishType'
import { toast } from 'react-toastify'

const categories = ['Основное', '1', 'Второе', '2', 'Напитки']
const translateCategories: { [id: string]: string } = {
	Основное: 'mainDishes',
	Второе: 'secondaryDishes',
	Напитки: 'drinks'
}

function Teacher({ dish }: { dish?: dishType }): JSX.Element {
	const [teacherClasses, setTeacherClasses] = useState([])
	const [currentClass, setCurrentClass] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const setPageTitle: any = usePageTitle()
	const { login, school } = useCredentials()
	const database = getDatabase()

	useEffect(() => {
		document.title = 'Мои классы'
		setPageTitle('Мои классы')

		getClasses()
	}, [])

	const getClasses = async () => {
		try {
			const userClasses = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/classes`)
				)
			).val()
			setTeacherClasses(userClasses)
			const fetchedClass = (
				await get(
					child(ref(database), `schools/${school}/classes/${userClasses[0]}`)
				)
			).val()

			setCurrentClass(fetchedClass)
			setIsLoading(false)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	return (
		<div className={styles.wrapper}>
			<section>
				<h3>Все классы</h3>
				{isLoading ? (
					'Загрузка'
				) : (
					<div className={styles['class-list']}>
						{teacherClasses.map((item: any) => (
							<div className={styles.class} key={item.name}>
								<p className={styles.classname}>{currentClass!['title']}</p>
								<div className={styles.classdivider}></div>
								<p>11:15 - 12:00</p>
								<div className={styles.classdivider}></div>
								<p className={styles.classPopulation}>
									{currentClass!['studentsCount']} чел.
								</p>
							</div>
						))}
					</div>
				)}
			</section>
			<div className={styles.divider}></div>
			<section>
				{isLoading ? (
					'Загрузка'
				) : (
					<>
						<h3 style={{ marginBottom: '16px' }}>
							Ближайший на питание - {currentClass!['title']}
						</h3>
						<div className={styles.students}>
							{Object.values(currentClass!['students']).map((item: any) => (
								<label key={item!.id}>
									<p>{item.name}</p>
									<input type={'checkbox'} />
								</label>
							))}
						</div>
						<div className={styles.bottom}>
							<AlphaButton
								type={'dark-submit'}
								clickHandler={() => {
									toast(`Посещаемость класса ${currentClass!['title']} отмечена!`)
								}}
							>
								Отметить отсутствующих
							</AlphaButton>
						</div>
					</>
				)}
			</section>
		</div>
	)
}

export default Teacher
