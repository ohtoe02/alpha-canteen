import styles from './DishList.module.scss'
import { dishType } from '../../../../utils/types/dishes/dishType'
import DishCard from '../dish-card/DishCard'
import { useState } from 'react'

function DishList({
	dishes,
	cart,
	category,
	title,
	chooseHandler
}: {
	dishes: dishType[]
	cart: { [id: string]: dishType | null }
	category: string
	title: string
	chooseHandler: (id: dishType | null) => void
}): JSX.Element {
	const [currentPage, setCurrentPage] = useState(1)
	const maxPages = Math.ceil(dishes.length / 4)

	const selectHandler = (event: any, dish: dishType) => {
		const newDish = cart[category] === dish ? null : dish
		chooseHandler(newDish)
	}

	const currentDishes = dishes.slice(
		4 * (currentPage - 1),
		Math.min(4 * currentPage, dishes.length)
	)

	return (
		<div className={styles.wrapper}>
			<h3>{title}</h3>
			<section className={styles['dish-list']}>
				{currentDishes.map(dish => {

					return (
						<DishCard
							key={dish!.id}
							id={dish!.id}
							isSelected={dish!.id === cart[category]?.id}
							selectHandler={(event: any) => {
								selectHandler(event, dish)
							}}
							dish={dish}
						/>
					)
				})}
			</section>
			<div className={styles.pagination}>
				<button
					className={styles['']}
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage <= 1}
				>
					{`<`}
				</button>
				<p>{currentPage}</p>
				<button
					onClick={() => {
						setCurrentPage(currentPage + 1)
					}}
					disabled={maxPages === currentPage}
				>
					{`>`}
				</button>
			</div>
		</div>
	)
}

export default DishList
