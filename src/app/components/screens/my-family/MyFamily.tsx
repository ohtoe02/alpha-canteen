import styles from './MyFamily.module.scss'
import KidList from '../../ui/cards/kid-list/KidList'
import { usePageTitle } from '../../layouts/main/MainLayout'
import { useEffect, useState } from 'react'
import { child, get, getDatabase, ref } from 'firebase/database'
import { useCredentials } from '../../../../hooks/use-auth'
import { KidType } from '../../../utils/types/kidType'
import HistoryList from '../../ui/cards/history-list/HistoryList'
import { OrderType } from '../../../utils/types/orderType'
import AlphaButton from '../../ui/buttons/AlphaButton'
import { useNavigate } from 'react-router-dom'

function MyFamily(): JSX.Element {
	const [kids, setKids] = useState<KidType[]>([])
	const [orders, setOrders] = useState<OrderType[]>([])
	const setPageTitle: any = usePageTitle()
	const database = getDatabase()
	const navigate = useNavigate()
	const { login, school } = useCredentials()

	const getCurrentOrders = async () => {
		try {
			const userOrders = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/requests`)
				)
			).val()

			// @ts-ignore
			setOrders(Object.values(userOrders).reverse().splice(0, 2))
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	const getKids = async () => {
		try {
			const userKids = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/family/kids`)
				)
			).val()
			const emptyOne: KidType[] = Object.keys(userKids).map(item => {
				return { id: item, ...userKids[item] }
			})

			setKids(emptyOne)

			// console.log(kids)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	useEffect(() => {
		document.title = 'Мой профиль'
		setPageTitle('Мой профиль')

		getKids()
		getCurrentOrders()
	}, [])

	return (
		<div className={styles.wrapper}>
			<KidList kids={kids} />
			<div className={styles.divider}></div>
			<section className={styles.left}>
				<h3>Активные заявки</h3>
				<HistoryList orders={orders} />
				<AlphaButton
					type={'navigate'}
					clickHandler={() => navigate('/history')}
				>
					Перейти в историю заявок
				</AlphaButton>
			</section>
		</div>
	)
}

export default MyFamily
