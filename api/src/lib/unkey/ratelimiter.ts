import { Ratelimit } from '@unkey/ratelimit'

export const Ratelimiter = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY,
  namespace: process.env.UNKEY_NAMESPACE,
  limit: 50,
  duration: '1m',
  async: true,
})
