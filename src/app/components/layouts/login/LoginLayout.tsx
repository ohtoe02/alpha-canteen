import styles from './LoginLayout.module.scss'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import AlphaButton from '../../ui/buttons/AlphaButton'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { child, get, getDatabase, ref } from 'firebase/database'
import { setUser } from '../../../store/slices/userSlice'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/use-auth'
import DatalistInput from 'react-datalist-input'

type Inputs = {
	login: string
	password: string
	school: string
}

function LoginLayout(): JSX.Element {
	const [schools, setSchools] = useState<{ [id: string]: string }[]>([])
	const [school, setSchool] = useState('')
	const [reversedSchools, setReversedSchools] = useState<
		{ [id: string]: string }[]
	>([])
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<Inputs>()

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const database = getDatabase()

	const { isAuth } = useAuth()

	if (isAuth) return <Navigate to={'/menu'} replace />

	useEffect(() => {
		document.title = 'Вход в систему'
		getSchools()
	}, [])

	const getSchools = async () => {
		try {
			const dbSchools = (await get(child(ref(database), `allSchools`))).val()
			const schoolList = Object.keys(dbSchools).map(item => {
				return { [item]: dbSchools[item] }
			})
			const reversedList = Object.keys(dbSchools).map(item => {
				return { [dbSchools[item]]: item }
			})

			setSchools(schoolList)
			setReversedSchools(reversedList)
		} catch (e) {}
	}

	const onSubmit: SubmitHandler<Inputs> = async data => {
		const getUser = async () => {
			try {
				const user = (
					await get(
						child(ref(database), `schools/${school}/users/${data.login}/`)
					)
				).val()
				if (user.password === data.password) {
					dispatch(setUser({ login: data.login, school: user.school }))
					navigate('/menu')
				} else {
					alert('Неверный пароль')
				}
			} catch (e) {
				console.log('Error on fetching')
			}
		}

		await getUser().then(() => {
			navigate('/')
		})
	}

	return (
		<main className={styles['login-container']}>
			{isAuth && <Navigate to={'/'} />}
			<h1 className={styles.header}>Вход в систему</h1>
			<form className={styles['login-form']} onSubmit={handleSubmit(onSubmit)}>
				<input
					{...register('login', { required: true })}
					type={'text'}
					placeholder={'Логин'}
					className={errors.login ? styles.error : ''}
				/>
				<input
					{...register('password', { required: true, minLength: 3 })}
					type={'password'}
					placeholder={'Пароль'}
					className={errors.password ? styles.error : ''}
				/>
				<DatalistInput
					label={''}
					placeholder={'Школа'}
					style={{ borderRadius: '8px' }}
					onSelect={value => {
						setSchool(value['id'][0])
					}}
					className={errors.password ? styles.error : ''}
					items={schools.map(school => {
						return { id: Object.keys(school), value: Object.values(school) }
					})}
				/>
				{/*<input*/}
				{/*	{...register('school', { required: true })}*/}
				{/*	autoComplete={'off'}*/}
				{/*	list={'schools'}*/}
				{/*	placeholder={'Школа'}*/}
				{/*	className={errors.school ? styles.error : ''}*/}
				{/*/>*/}
				{/*<datalist id={'schools'}>*/}
				{/*	{schools.map(school => (*/}
				{/*		<option*/}
				{/*			value={Object.values(school)[0]}*/}
				{/*			key={Object.keys(school)[0]}*/}
				{/*		></option>*/}
				{/*	))}*/}
				{/*</datalist>*/}
				<AlphaButton type={'login'}>Войти</AlphaButton>
			</form>
			<section className={styles.hint}>
				Войдите с помощью данных, полученных от преподавателя или администрации
				школы.
			</section>
		</main>
	)
}

export default LoginLayout
