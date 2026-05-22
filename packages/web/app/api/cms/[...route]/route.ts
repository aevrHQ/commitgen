import { createCmsHandler } from '@airdraft/next'
import airdraft from '@/airdraft.config'

export const { GET, POST, PUT, DELETE } = createCmsHandler(airdraft)
