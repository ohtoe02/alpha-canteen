import styles from './KidCard.module.scss'
import { KidType } from '../../../../utils/types/kidType'
import kidImage from '../../../../assets/2.png'
import editIcon from '../../../../../assets/Edit.png'

function KidCard({ kidData }: { kidData: KidType }): JSX.Element {
	return (
		<div className={styles.card}>
			<div className={styles.left}>
				<img src={kidData.image ? kidData.image : kidImage} alt={'kid'} />
				<div className={styles['kid-info']}>
					<p>{kidData.name}</p> <p>11Б Класс</p>
				</div>
			</div>
			<div className={styles.edit}><img src={editIcon} alt="edit"/></div>
		</div>
	)
}

export default KidCard
