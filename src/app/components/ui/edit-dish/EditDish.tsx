import styles from './EditDish.module.scss'
import { SubmitHandler, useForm } from 'react-hook-form'
import cameraIcon from '../../../../assets/Camera.png'
import AlphaButton from '../buttons/AlphaButton'
import { useEffect, useState } from 'react'
import { getDatabase, ref, push, set, update, remove } from 'firebase/database'
import {
	getStorage,
	ref as storageRef,
	uploadBytes,
	getDownloadURL
} from 'firebase/storage'
import { useCredentials } from '../../../../hooks/use-auth'
import { toast } from 'react-toastify'
import DatalistInput, { useComboboxControls } from 'react-datalist-input'
import { dbCategoriesNames } from '../../../utils/constants'

const SelectAction = ({
	changeOptionHandler
}: {
	changeOptionHandler: (option: string) => void
}) => {
	return (
		<>
			<p>Вы можете</p>
			<div className={styles.submit}>
				<AlphaButton
					type={'dark-submit'}
					clickHandler={() => changeOptionHandler('add')}
				>
					Добавить блюдо
				</AlphaButton>
			</div>
			<p style={{ textAlign: 'center', width: '75%' }}>
				или редактировать блюдо, выбрав его в меню слева
			</p>
		</>
	)
}

type Inputs = {
	title: string
	category: string
	weight: string
	price: string
	image: FileList
}

const AddDish = ({
	changeOptionHandler,
	type,
	dish
}: {
	changeOptionHandler: (option: string) => void
	type: string
	dish?: any
}) => {
	const {
		register,
		setValue: setItemValue,
		handleSubmit,
		watch
	} = useForm<Inputs>()
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [selectedCategory, setSelectedCategory] = useState('')
	const { value, setValue } = useComboboxControls({
		isExpanded: false,
		initialValue: dish ? dbCategoriesNames[dish['category']] : ''
	})
	const { school } = useCredentials()
	const database = getDatabase()
	const storage = getStorage()

	useEffect(() => {
		if (type === 'edit') {
			setItemValue('title', '')
			setItemValue('price', '')
			setItemValue('weight', '')
			setSelectedImage(null)
		}
	}, [type])

	useEffect(() => {
		if (type === 'edit') {
			setItemValue('title', dish['title'])
			setItemValue('price', dish['price'])
			setValue(dbCategoriesNames[dish['category']])
			setSelectedCategory(dish['category'])
			setItemValue('weight', dish['weight'])
			setSelectedImage(dish['picture'])
		}
	}, [dish])

	useEffect(() => {
		return () => {
			const image = watch('image')[0]
			if (!image) return
			const imageUrl = URL.createObjectURL(image)
			setSelectedImage(imageUrl)
		}
	}, [watch('image')])

	const addDish: SubmitHandler<Inputs> = async data => {
		try {
			const image = data.image[0]
			const key = await push(
				ref(database, `schools/${school}/menu/dishes/${selectedCategory}`)
			).key
			const imageRef = storageRef(storage, `Images/${school}/${key}`)

			const uploadedImage = await uploadBytes(imageRef, image)
			const imageURL = await getDownloadURL(uploadedImage.ref)
			await set(
				ref(database, `schools/${school}/menu/dishes/${selectedCategory}/${key}`),
				{
					...data,
					category: selectedCategory,
					picture: imageURL,
					id: key
				}
			)

			toast.success(`Блюдо ${data.title} успешно добавлено!`, {
				position: 'bottom-right'
			})
			changeOptionHandler('select')
		} catch (e) {
			console.log(e)
		}
	}

	const editDish: SubmitHandler<Inputs> = async data => {
		console.log(data)
		const currentDishRef = ref(
			database,
			`schools/${school}/menu/dishes/${selectedCategory}/${dish['id']}`
		)
		await update(currentDishRef, {
			category: selectedCategory,
			price: data.price,
			title: data.title,
			weight: data.weight
		})
			.then(e => {
				console.log('updated!')
			})
			.catch(e => console.log(e))
	}

	const removeDish = () => {
		remove(
			ref(
				database,
				`schools/${school}/menu/dishes/${dish['category']}/${dish['id']}`
			)
		).then(r => {
			toast.success('Блюдо удалено!')
			changeOptionHandler('select')
		})
	}

	return (
		<form onSubmit={handleSubmit(type === 'add' ? addDish : editDish)}>
			<div className={styles['add-edit-form']}>
				<div className={styles['dish-image']}>
					<p>Добавить фото</p>
					<img src={cameraIcon} alt={''} />
					<input
						type='file'
						accept={'image/*'}
						alt={''}
						{...register('image', { required: true })}
					/>
					<img
						style={{
							visibility: selectedImage ? 'visible' : 'hidden',
							width: '100%',
							height: '100%',
							position: 'absolute',
							top: 0,
							objectFit: 'cover',
							backgroundPosition: 'center'
						}}
						src={selectedImage ? selectedImage : ''}
						alt={''}
					/>
				</div>
				<div className={styles.inputs}>
					<input
						type='text'
						placeholder={'Название'}
						autoComplete={'off'}
						{...register('title', { required: true })}
					/>
					<DatalistInput
						label={''}
						placeholder={'Категория'}
						value={value}
						onSelect={item => {
							setSelectedCategory(item.id)
							setValue(item.value)
						}}
						items={[
							{ id: 'mainDishes', value: 'Основное' },
							{ id: 'secondaryDishes', value: 'Второе' },
							{ id: 'drinks', value: 'Напитки' }
						]}
						{...register('category', { required: false })}
					/>
					{/*<input*/}
					{/*	type='text'*/}
					{/*	placeholder={'Категория'}*/}
					{/*	{...register('category', { required: true })}*/}
					{/*	autoComplete={'off'}*/}
					{/*/>*/}
					<div className={styles.inline}>
						<input
							type='text'
							placeholder={'Вес'}
							autoComplete={'off'}
							{...register('weight', { required: true, max: 1000 })}
						/>
						<input
							type='text'
							placeholder={'Цена'}
							autoComplete={'off'}
							{...register('price', { required: true, max: 1000 })}
						/>
					</div>
				</div>
			</div>
			<div className={styles.submit}>
				<AlphaButton type={'dark-submit'}>
					{type === 'add' ? 'Добавить блюдо' : 'Изменить блюдо'}
				</AlphaButton>
				{type === 'edit' ? (
					<AlphaButton type={'cancel'} clickHandler={removeDish}>
						Удалить блюдо
					</AlphaButton>
				) : (
					''
				)}
			</div>
		</form>
	)
}

function EditDish({
	type,
	dish,
	changeOptionHandler
}: {
	type: string
	dish: any
	changeOptionHandler: (option: string) => void
}): JSX.Element {
	const elements: { [id: string]: JSX.Element } = {
		select: <SelectAction changeOptionHandler={changeOptionHandler} />,
		add: <AddDish type={'add'} changeOptionHandler={changeOptionHandler} />,
		edit: (
			<AddDish
				dish={dish}
				type={'edit'}
				changeOptionHandler={changeOptionHandler}
			/>
		)
	}

	return <>{elements[type]}</>
}

export default EditDish
