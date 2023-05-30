export function useAuth() {
	const login = localStorage.getItem('login');

	return {
		isAuth: !!login,
		login
	}
}
export function useCredentials() {
	const login = localStorage.getItem('login');
	const school = localStorage.getItem('school');

	return {
		login,
		school
	}
}
