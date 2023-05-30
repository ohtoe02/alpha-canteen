import styles from './CanteenDishCard.module.scss'

function CanteenDishCard({
	dish,
	onClick
}: {
	dish: any
	onClick?: () => void
}): JSX.Element {
	return (
		<div className={`${styles['canteen-card']} ${styles.active}`} onClick={onClick}>
			<img className={styles.preview} src={dish['picture'] ? dish['picture'] : 'https://assets.materialup.com/uploads/b03b23aa-aa69-4657-aa5e-fa5fef2c76e8/preview.png'} alt='' />
			<p style={{flex: '1', textOverflow: 'ellipsis'}}>{dish ? dish['title'] : ''}</p>
			<div className={styles.divider}></div>
			<p>{dish.count} Заказов</p>
		</div>
	)
}

export default CanteenDishCard
