// Proves cache.js fails open when Redis is nominally connected ("ready") but
// a specific GET/SET command fails — the scenario the in-service try/catch
// blocks are supposed to handle. Uses node:test's module mocking to swap in
// a fake ioredis client whose commands always reject, so this doesn't need a
// real Redis instance. Run with: node --experimental-test-module-mocks --test
import { describe, test, mock } from 'node:test'
import assert from 'node:assert/strict'

describe('cache — Redis command failure fails open', () => {
  test('a "ready" Redis client whose GET/SET reject never throws into cacheGet/cacheSet, and a failed SET is still readable via the in-memory fallback', async () => {
    process.env.REDIS_URL = 'redis://fake-host-for-test:6379'

    class FakeRedisClient {
      constructor() { this.status = 'connecting' }
      on() { return this } // no-op event-emitter interface (cache.js calls redis.on('error', ...))
      async connect() { this.status = 'ready' }
      async get() { throw new Error('simulated Redis GET failure') }
      async set() { throw new Error('simulated Redis SET failure') }
    }

    mock.module('ioredis', { defaultExport: FakeRedisClient })

    // Cache-busting query param forces a fresh module evaluation regardless
    // of whether another test file already imported (and cached) the real
    // utils/cache.js earlier in this process.
    const { cacheGet, cacheSet, redis } = await import(`../utils/cache.js?t=${Date.now()}`)

    assert.equal(redis.status, 'ready', 'the fake client should report ready after connect()')

    const key = `test:redis-failure:${Date.now()}`

    // WRITE: must not throw, even though the fake Redis SET always rejects.
    await assert.doesNotReject(() => cacheSet(key, { v: 'fell back to memory' }))

    // READ: must not throw either, and — this is the part that was actually
    // broken before this session's fix — must find the value the failed SET
    // fell back to storing in-memory, not just return null because Redis
    // (nominally "ready") also fails on every GET.
    const result = await cacheGet(key)
    assert.deepEqual(result, { v: 'fell back to memory' })

    delete process.env.REDIS_URL
  })
})
