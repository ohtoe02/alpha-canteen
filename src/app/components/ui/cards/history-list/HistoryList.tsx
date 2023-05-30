import styles from './HistoryList.module.scss'
import HistoryCard from '../history-card/HistoryCard'
import {OrderType} from "../../../../utils/types/orderType";

function HistoryList({ orders }: { orders: OrderType[] }): JSX.Element {
	return (
		<div className={styles['history-list']}>
			{orders.map(order => <HistoryCard order={order} key={order.id} />)}
		</div>
	)
}

export default HistoryList
