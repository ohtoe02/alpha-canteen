import styles from './Menu.module.scss'
import DishList from '../../ui/cards/dish-list/DishList'
import { usePageTitle } from '../../layouts/main/MainLayout'
import { useEffect, useState } from 'react'
import { getDatabase, ref, get, child } from 'firebase/database'
import Modal from 'react-modal'
import { categoriesNames } from '../../../utils/constants'
import Checkout from '../../ui/checkout/Checkout'
import { dishType } from '../../../utils/types/dishes/dishType'
import {useCredentials} from "../../../../hooks/use-auth";

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		padding: 0,
		borderRadius: '16px',
		boxShadow: '0 0 8px rgba(40, 40, 40, 0.4)',
		backgroundColor: 'white',
		border: 'none',
		transform: 'translate(-50%, -50%)'
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		zIndex: 1000
	}
}

// @ts-ignore
function Menu(): JSX.Element {
	const [schoolDishesCur, setSchoolDishesCur] = useState({
		drinks: [],
		mainDishes: [],
		secondaryDishes: []
	})
	const [cart, setCart] = useState<{ [id: string]: dishType | null }>({
		mainDish: null,
		secondDish: null,
		drink: null
	})
	const [isCartOpen, setIsCartOpen] = useState(false)
	const setPageTitle: any = usePageTitle()
	const database = getDatabase()
	const { school } = useCredentials()

	useEffect(() => {
		document.title = 'Меню'
		setPageTitle('Меню')

		const getDishes = async () => {
			try {
				const schoolDishes = (
					await get(child(ref(database), `schools/${school}/menu/dishes/`))
				).val()
				setSchoolDishesCur(schoolDishes)
			} catch (e) {
				console.log('Error on fetching', e)
			}
		}

		getDishes()
	}, [])

	const updateCart = (category: string, dish: dishType | null) => {
		setCart({ ...cart, [category]: dish })
	}

	const clearCart = () => {
		setCart({
			mainDish: null,
			secondDish: null,
			drink: null
		})
		setIsCartOpen(false)
	}

	return (
		<div className={`${styles.container}`}>
			<Modal
				shouldCloseOnEsc={true}
				ariaHideApp={false}
				role={'dialog'}
				shouldCloseOnOverlayClick={true}
				isOpen={isCartOpen}
				style={customStyles}
			>
				<Checkout
					cart={cart}
					closeHandler={() => {
						setIsCartOpen(false)
					}}
					removeDish={updateCart}
					clearCart={clearCart}
				/>
			</Modal>

			<div className={styles['dish-container']}>
				<DishList
					dishes={Object.values(schoolDishesCur['mainDishes'])}
					cart={cart}
					category={'mainDish'}
					title={'Основное блюдо'}
					chooseHandler={dish => {
						updateCart('mainDish', dish)
					}}
				/>
				<div className={styles.divider} />
				<DishList
					dishes={Object.values(schoolDishesCur['secondaryDishes'])}
					cart={cart}
					category={'secondDish'}
					title={'Второе блюдо'}
					chooseHandler={dishId => {
						updateCart('secondDish', dishId)
					}}
				/>
				<div className={styles.divider}></div>
				<DishList
					dishes={Object.values(schoolDishesCur['drinks'])}
					cart={cart}
					category={'drink'}
					title={'Напитки'}
					chooseHandler={dishId => {
						updateCart('drink', dishId)
					}}
				/>
			</div>
			{Object.entries(cart).filter(item => item[1]).length ? (
				<div
					className={styles['cart-button']}
					onClick={() => setIsCartOpen(true)}
				>
					{Object.entries(cart)
						.filter(item => item[1])
						.map(item => categoriesNames[item[0]])
						.join(' - ')}
				</div>
			) : (
				''
			)}
		</div>
	)
}

export default Menu
