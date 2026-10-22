import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const defaultApiBaseUrl = Platform.OS === 'android'
	? 'http://10.0.2.2/TCC'
	: 'http://localhost/TCC';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultApiBaseUrl;

export async function apiFetch(endpoint, options = {}) {
	const token = await AsyncStorage.getItem('auth_token');
	const headers = { ...options.headers };

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return fetch(`${API_BASE_URL}/${endpoint}`, {
		...options,
		headers,
	});
}

export async function clearSession() {
	try {
		await apiFetch('logout.php', { method: 'POST' });
	} catch (error) {
		console.warn('Não foi possível revogar a sessão no servidor.', error);
	}
	await AsyncStorage.multiRemove([
		'usuario_id',
		'usuario_nome',
		'auth_token',
		'pending_group_invite',
	]);
}
