import styles from './DishCard.module.scss'
import { dishType } from '../../../../utils/types/dishes/dishType'

function DishCard({ id, title, weight, price, image }: dishType): JSX.Element {
	return (
		<div className={styles['dish-card']}>
			<div className={styles['image-wrapper']}>
				<img className={styles.image} src={image} alt={title} />
				<div className={styles['price-tag']}>{price} ₽</div>
			</div>
			<p className={styles.weight}>{weight} г.</p>
			<p>{title}</p>
		</div>
	)
}

export default DishCard
