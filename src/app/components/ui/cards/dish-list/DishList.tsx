import styles from './DishList.module.scss'
import { dishType } from '../../../../utils/types/dishes/dishType'
import DishCard from '../dish-card/DishCard'
import { useEffect, useState } from 'react'

function DishList({
	dishes,
	title
}: {
	dishes: dishType[]
	title: string
}): JSX.Element {
	const [currentPage, setCurrentPage] = useState(1)
	const maxPages = Math.ceil(dishes.length / 4)

	const currentDishes = dishes.slice(
		4 * (currentPage - 1),
		Math.min(4 * currentPage, dishes.length)
	)

	return (
		<div className={styles.wrapper}>
			<h2>{title}</h2>
			<section className={styles['dish-list']}>
				{currentDishes.map(dish => (
					<DishCard
						key={dish.id}
						image={dish.image}
						price={dish.price}
						weight={dish.weight}
						id={dish.id}
						title={dish.title}
					/>
				))}
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
