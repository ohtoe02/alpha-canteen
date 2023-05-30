import styles from './Buttons.module.scss'
import { ReactNode } from 'react'

const buttonTypes: { [action: string]: string } = {
	submit: styles.submit,
	cancel: styles.cancel,
	login: styles.login,
	navigate: styles.navigate,
	'dark-submit': styles['dark-submit'],
}

function AlphaButton({
	children,
	type,
	clickHandler
}: {
	children: ReactNode
	type: 'submit' | 'cancel' | 'login' | 'navigate' | 'dark-submit'
	clickHandler?: () => void
}): JSX.Element {
	return (
		<button onClick={clickHandler} className={buttonTypes[type]}>
			{children}
		</button>
	)
}

export default AlphaButton
