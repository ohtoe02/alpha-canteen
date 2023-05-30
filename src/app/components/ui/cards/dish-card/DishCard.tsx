import styles from './DishCard.module.scss'
import { dishType } from '../../../../utils/types/dishes/dishType'
import { useState } from 'react'

function DishCard({
	id,
	dish,
	isSelected,
	selectHandler
}: {
	id: string
	dish: dishType
	isSelected: boolean
	selectHandler: (event: any) => void
}): JSX.Element {
	const [isVisible, setIsVisible] = useState(false)

	return (
		<div
			className={`${styles['dish-card']} ${isSelected ? styles.selected : ''}`}
			onMouseEnter={() => {
				setIsVisible(true)
			}}
			onMouseLeave={() => {
				setIsVisible(false)
			}}
		>
			<div className={styles['image-wrapper']}>
				<img
					className={styles.image}
					src={dish!.picture}
					alt={dish!.title}
					loading={'lazy'}
				/>
				{isSelected && <div className={`${styles.carted}`}>В корзине</div>}
				<div
					className={`${styles.add} ${isVisible ? styles.visible : ''}`}
					onClick={selectHandler}
				>
					{isSelected ? '-' : '+'}
				</div>
				<div className={styles['price-tag']}>{dish!.price} ₽</div>
			</div>
			<h4 className={styles.weight}>{dish!.weight} г.</h4>
			<h4>{dish!.title}</h4>
		</div>
	)
}

export default DishCard
