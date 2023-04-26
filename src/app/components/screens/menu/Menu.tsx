import styles from './Menu.module.scss'
import dishesMock from '../../../utils/mock/dishes'
import DishList from '../../ui/cards/dish-list/DishList'
import {usePageTitle} from "../../layouts/main/MainLayout";
import {useEffect} from "react";

function Menu(): JSX.Element {
	const setPageTitle : any = usePageTitle()

	useEffect(() => {
		document.title = 'Меню'
		setPageTitle('Меню')
	}, [])

	const dishes = dishesMock

	return (
		<div className={`${styles.container}`}>
			<div className={styles['dish-container']}>
				<DishList dishes={dishes} title={'Основное блюдо'} />
				<div className={styles.divider}></div>
				<DishList dishes={dishes} title={'Второе блюдо'} />
				<div className={styles.divider}></div>
				<DishList dishes={dishes} title={'Напитки'} />
			</div>
		</div>
	)
}

export default Menu
