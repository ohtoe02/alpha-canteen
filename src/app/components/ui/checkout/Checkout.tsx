import styles from './Checkout.module.scss'
import AlphaButton from '../buttons/AlphaButton'
import { dishType } from '../../../utils/types/dishes/dishType'
import removeIcon from '../../../../assets/Remove.svg'
import { categoriesNames, dbCategoriesNames } from '../../../utils/constants'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { child, get, getDatabase, push, ref, set } from 'firebase/database'
import { KidType } from '../../../utils/types/kidType'
import { useCredentials } from '../../../../hooks/use-auth'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import DatalistInput, { useComboboxControls } from 'react-datalist-input'
import {toast} from "react-toastify";

function CartItem({
	dish,
	category,
	removeHandler
}: {
	dish: dishType
	category: string
	removeHandler: () => void
}): JSX.Element {
	return (
		<div className={styles['cart-item']}>
			{dish ? (
				<>
					<img src={dish.picture} alt={dish.title} />
					<div className={styles['dish-info']}>
						<p className={styles['dish-title']}>{dish.title}</p>
						<p className={styles['dish-weight']}>{dish.weight} г.</p>
					</div>
					<h3 className={styles['dish-price']}>{dish.price}₽</h3>
					<div className={styles.remove} onClick={removeHandler}>
						<img src={removeIcon} alt={'remove'} />
					</div>
				</>
			) : (
				<h3 className={styles['no-dish-message']}>
					Еще можно добавить {categoriesNames[category].toLowerCase()}
				</h3>
			)}
		</div>
	)
}

function CartList({
	cart,
	removeDish
}: {
	cart: { [id: string]: dishType | null }
	removeDish: (category: string, dishId: dishType | null) => void
}): JSX.Element {
	return (
		<div className={styles['cart-list']}>
			<CartItem
				dish={cart['mainDish']}
				category={'mainDish'}
				removeHandler={() => {
					removeDish('mainDish', null)
				}}
			></CartItem>
			<CartItem
				dish={cart['secondDish']}
				category={'secondDish'}
				removeHandler={() => {
					removeDish('secondDish', null)
				}}
			></CartItem>
			<CartItem
				dish={cart['drink']}
				category={'drink'}
				removeHandler={() => {
					removeDish('drink', null)
				}}
			></CartItem>
		</div>
	)
}

type CheckoutInput = {
	kid: string
}

function SecondPage({
	cart,
	removeDish,
	clearCart,
	closeHandler,
	goBack
}: {
	cart: { [id: string]: dishType | null }
	removeDish: (category: string, dish: dishType | null) => void
	clearCart: () => void
	closeHandler: () => void
	goBack: () => void
}) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
	const { register, handleSubmit } = useForm<CheckoutInput>()
	const { login, school } = useCredentials()
	const [kids, setKids] = useState<KidType[]>([])
	const database = getDatabase()
	const { value, setValue } = useComboboxControls({
		isExpanded: false
	})

	const price = Object.values(cart)
		.filter(item => item !== null)
		.reduce((acc, currentValue) => acc + +currentValue!.price, 0)

	const onSubmit: SubmitHandler<CheckoutInput> = async data => {
		const currentKid = kids.find(kid => kid.name === value)
		if (!currentKid) return

		let dishes = {}

		Object.entries(cart)
			.filter(item => {
				return item[1] !== null
			})
			.forEach(item => (dishes = { ...dishes, [item[0]]: item[1]?.id }))

		let order: { [id: string]: string | number | {} } = {
			dishes: dishes,
			info: {
				parent: login!,
				class: currentKid.classId,
				price: price,
				kidId: currentKid.id,
				kidName: currentKid.name,
				time: selectedDate?.toISOString()!
			}
		}

		const key = await push(ref(database, `schools/${school}/classes/${currentKid.classId}/requests`)).key

		order = {...order, id: key!}

		await set(ref(database, `schools/${school}/classes/${currentKid.classId}/requests/${key}`), order)
		await set(ref(database, `schools/${school}/requests/${key}`), order)
		await set(ref(database, `schools/${school}/users/${login}/requests/${key}`), order)

		toast.success('Заявка успешно оставлена!')
		clearCart()
	}

	useEffect(() => {
		getKids()
	}, [])

	const getKids = async () => {
		try {
			const kidsData = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/family/kids`)
				)
			).val()
			const userKids: KidType[] = Object.keys(kidsData).map(item => {
				return { id: item, ...kidsData[item] }
			})

			setKids(userKids)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	registerLocale('ru', ru)

	return (
		<form>
			<button className={styles.close} onClick={closeHandler}>
				X
			</button>
			<h1>Оформление</h1>
			<div className={styles.inputs}>
				<label>
					Кто питается:
					<DatalistInput
						label={''}
						placeholder={'Ребенок'}
						value={value}
						onSelect={item => {
							setValue(item.value)
						}}
						items={kids.map(item => {
							return {
								id: item.id,
								value: item.name
							}
						})}
						{...register('kid', { required: false })}
					/>
				</label>
				<label>
					Когда питается:
					<ReactDatePicker
						portalId={'root-portal'}
						popperClassName={'datepicker'}
						selected={selectedDate}
						autoComplete={'disable'}
						className={styles.datepicker}
						minDate={new Date()}
						locale={'ru'}
						onChange={date => setSelectedDate(date)}
					/>
				</label>
			</div>
			<div className={styles.divider} />
			<div className={styles.bottom} style={{}}>
				<AlphaButton type={'cancel'} clickHandler={goBack}>
					Назад
				</AlphaButton>
				<h3>Итого: {price}₽</h3>
				<AlphaButton type={'dark-submit'} clickHandler={handleSubmit(onSubmit)}>
					Готово
				</AlphaButton>
			</div>
		</form>
	)
}

function FirstPage({
	cart,
	removeDish,
	clearCart,
	closeHandler,
	goNext
}: {
	cart: { [id: string]: dishType | null }
	removeDish: (category: string, dish: dishType | null) => void
	clearCart: () => void
	closeHandler: () => void
	goNext: () => void
}) {
	const price = Object.values(cart)
		.filter(item => item !== null)
		.reduce((acc, currentValue) => acc + +currentValue!.price, 0)

	return (
		<>
			<button className={styles.close} onClick={closeHandler}>
				X
			</button>
			<h1>Моя корзина</h1>
			<CartList cart={cart} removeDish={removeDish} />
			<div className={styles.divider} />
			<div className={styles.bottom}>
				<AlphaButton type={'cancel'} clickHandler={clearCart}>
					Очистить
				</AlphaButton>
				<h3>Итого: {price}₽</h3>
				<AlphaButton type={'dark-submit'} clickHandler={goNext}>
					Оформить
				</AlphaButton>
			</div>
		</>
	)
}

function Checkout({
	cart,
	removeDish,
	clearCart,
	closeHandler
}: {
	cart: { [id: string]: dishType | null }
	removeDish: (category: string, dish: dishType | null) => void
	clearCart: () => void
	closeHandler: () => void
}): JSX.Element {
	const [isFirstPage, setIsFirstPage] = useState(true)

	return (
		<section className={styles.checkout}>
			{isFirstPage ? (
				<FirstPage
					cart={cart}
					removeDish={removeDish}
					clearCart={clearCart}
					closeHandler={closeHandler}
					goNext={() => setIsFirstPage(false)}
				/>
			) : (
				<SecondPage
					cart={cart}
					removeDish={removeDish}
					clearCart={clearCart}
					closeHandler={closeHandler}
					goBack={() => setIsFirstPage(true)}
				/>
			)}
		</section>
	)
}

export default Checkout
