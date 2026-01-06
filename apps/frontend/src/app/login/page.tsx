'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button, Input } from '@/components'

export default function LoginPage() {
	const router = useRouter()

	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
				credentials: 'include',
			})

			// Проверяем статус ответа
			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
			}

			const json = await res.json()

			if (!json.ok) {
				throw new Error('Invalid password')
			}

			// Успешный логин - редирект на нужную страницу
			router.push('/admin')
			router.refresh() // Обновляем роутер чтобы middleware сработал
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error('Login error:', err)
			setError(err.message || 'An error occurred during login')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-1 items-center justify-center">
			<form onSubmit={handleLogin} className="border-border bg-card w-full max-w-md rounded-2xl border p-8 shadow-lg">
				<h1 className="mb-6 text-center text-3xl font-bold">Admin Login</h1>

				<div className="mb-2">
					<Input
						type="password"
						placeholder="Enter password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className="w-full"
						autoFocus
						disabled={loading}
					/>
				</div>

				{error && (
					<div>
						<p className="font-medium text-red-500">{error}</p>
					</div>
				)}

				<Button type="submit" disabled={loading} className="mt-6 w-full">
					{loading ? 'Logging in...' : 'Login'}
				</Button>
			</form>
		</div>
	)
}
