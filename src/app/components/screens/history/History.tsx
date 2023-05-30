import styles from './History.module.scss'
import HistoryCard from '../../ui/cards/history-card/HistoryCard'
import HistoryList from '../../ui/cards/history-list/HistoryList'
import { useEffect, useState } from 'react'
import { usePageTitle } from '../../layouts/main/MainLayout'
import { child, get, getDatabase, ref } from 'firebase/database'
import { useCredentials } from '../../../../hooks/use-auth'
import AlphaButton from '../../ui/buttons/AlphaButton'
import { useNavigate } from 'react-router-dom'
import { KidType } from '../../../utils/types/kidType'

function History(): JSX.Element {
	const [orderHistory, setOrderHistory] = useState([])
	const setPageTitle: any = usePageTitle()
	const database = getDatabase()
	const { login, school } = useCredentials()
	const navigate = useNavigate()

	const getHistory = async () => {
		try {
			const dbOrderHistory = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/requests`)
				)
			).val()

			// @ts-ignore
			setOrderHistory(Object.values(dbOrderHistory).reverse())
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	useEffect(() => {
		document.title = 'История заказов'
		setPageTitle('История заказов')

		getHistory()
	}, [])

	return (
		<div className={styles.container}>
			<HistoryList orders={orderHistory} />
			<AlphaButton
				type={'navigate'}
				clickHandler={() => {
					navigate('/family')
				}}
			>
				Перейти к активным заявкам
			</AlphaButton>
		</div>
	)
}

export default History
