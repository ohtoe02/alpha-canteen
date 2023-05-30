import styles from './CompactDishCard.module.scss'
import editIcon from '../../../../../assets/Edit.png'

function CompactDishCard({dish, onClick}: {dish: any, onClick: () => void}): JSX.Element {
	return (
		<div className={styles['compact-card']} onClick={onClick}>
			<img className={styles.preview} src={dish['picture']} alt='' />
			<div className={styles.info}>
				<p>{dish['title']}</p>
				<p style={{color: '#808080'}}>{dish['weight']} г.</p>
			</div>
			<h3>{dish['price']}₽</h3>
			<div className={styles.edit}>
				<img src={editIcon} alt='' />
			</div>
		</div>
	)
}

export default CompactDishCard
