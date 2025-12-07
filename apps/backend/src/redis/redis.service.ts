import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'

@Injectable()
export class RedisService implements OnModuleInit {
	private redis: Redis
	private readonly logger = new Logger(RedisService.name)
	private isEnabled = false

	onModuleInit() {
		// Поддержка Vercel KV и обычного Upstash
		const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
		const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

		if (!url || !token) {
			this.logger.warn('Redis not configured - caching disabled')
			this.logger.warn('Set KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV)')
			this.logger.warn('or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (Upstash)')
			this.isEnabled = false
			return
		}

		try {
			this.redis = new Redis({
				url,
				token,
			})
			this.isEnabled = true
			this.logger.log('✅ Redis connected successfully')
			this.logger.log(`📍 Using: ${url.includes('kv.vercel-storage.com') ? 'Vercel KV' : 'Upstash Redis'}`)
		} catch (error) {
			this.logger.error('❌ Redis connection failed', error)
			this.isEnabled = false
		}
	}

	async get<T>(key: string): Promise<T | null> {
		if (!this.isEnabled) return null

		try {
			const data = await this.redis.get(key)
			if (data) {
				this.logger.debug(`⚡ Cache HIT: ${key}`)
			}
			return data as T
		} catch (error) {
			this.logger.error(`Redis GET error for key ${key}:`, error)
			return null
		}
	}

	async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
		if (!this.isEnabled) return

		try {
			if (ttlSeconds) {
				await this.redis.set(key, value, { ex: ttlSeconds })
			} else {
				await this.redis.set(key, value)
			}
			this.logger.debug(`💾 Cache SET: ${key} (TTL: ${ttlSeconds || 'none'}s)`)
		} catch (error) {
			this.logger.error(`Redis SET error for key ${key}:`, error)
		}
	}

	async del(key: string): Promise<void> {
		if (!this.isEnabled) return

		try {
			await this.redis.del(key)
			this.logger.debug(`🗑️  Cache DELETE: ${key}`)
		} catch (error) {
			this.logger.error(`Redis DEL error for key ${key}:`, error)
		}
	}

	async delPattern(pattern: string): Promise<void> {
		if (!this.isEnabled) return

		try {
			const keys = await this.redis.keys(pattern)
			if (keys.length > 0) {
				await this.redis.del(...keys)
				this.logger.debug(`🗑️  Cache DELETE pattern: ${pattern} (${keys.length} keys)`)
			}
		} catch (error) {
			this.logger.error(`Redis DEL PATTERN error for pattern ${pattern}:`, error)
		}
	}

	// Дополнительный метод для проверки соединения
	async ping(): Promise<boolean> {
		if (!this.isEnabled) return false

		try {
			const result = await this.redis.ping()
			return result === 'PONG'
		} catch (error) {
			this.logger.error('Redis PING failed', error)
			return false
		}
	}
}
