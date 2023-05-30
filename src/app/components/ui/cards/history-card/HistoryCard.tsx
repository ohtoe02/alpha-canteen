import styles from './HistoryCard.module.scss'
import {OrderType} from "../../../../utils/types/orderType";
import {categoriesNames} from "../../../../utils/constants";

function HistoryCard({order}:  {order: OrderType}): JSX.Element {
	const formatCategories = () => {
		const dishCategories = Object.keys(order.dishes).map(item => categoriesNames[item])
		return dishCategories.join(' - ')
	}

	formatCategories()

	return (
		<div className={styles.card}>
			<h5 style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>Заявка {order.id} - {order.info.kidName}</h5>
			<div className={styles['bottom-info']}>
				<p className={styles.categories}>{formatCategories()}</p>
				<h2 className={styles.price}>{order.info.price}₽</h2>
			</div>
		</div>
	)
}

export default HistoryCard
