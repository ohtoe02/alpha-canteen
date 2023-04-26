import styles from './ActiveOrders.module.scss'
import OrderCard from "../../ui/cards/order-card/OrderCard";
import {usePageTitle} from "../../layouts/main/MainLayout";
import {useEffect} from "react";


function ActiveOrders(): JSX.Element {
	const setPageTitle : any = usePageTitle()

	useEffect(() => {
		document.title = 'Активные заявки'
		setPageTitle('Активные заявки')
	}, [])

	return (
		<div className={`${styles.container}`}>
			<div className={styles['orders-container']}>
				<OrderCard />
				<OrderCard />
				{/*<DishList dishes={dishes} title={'Основное блюдо'} />*/}
				{/*<DishList dishes={dishes} title={'Второе блюдо'} />*/}
				{/*<DishList dishes={dishes} title={'Напитки'} />*/}
			</div>
		</div>
	)
}

export default ActiveOrders
