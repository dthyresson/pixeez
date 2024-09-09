import { networkInterfaces } from 'os'

import chalk from 'chalk'
import qrcode from 'qrcode-terminal'

import { createServer } from '@redwoodjs/api-server'
import { getConfig } from '@redwoodjs/project-config'

import { logger } from 'src/lib/logger'

const getNetworkUrl = (port: number) => {
  const interfaces = networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // assumes dev is http
        return `http://${iface.address}:${port}`
      }
    }
  }
  return null
}

const showQRCode = () => {
  // only show QR code in dev
  if (process.env.NODE_ENV === 'development') {
    const port = getConfig().web.port
    const appTitle = getConfig().web.title
    const networkUrl = getNetworkUrl(port)

    if (networkUrl) {
      console.log(
        `\nUse this ${chalk.bgGreenBright('QR Code')} to open ${chalk.bgMagenta(
          appTitle
        )} on your 📱phone or tablet\n`
      )
      qrcode.generate(networkUrl, { small: true })
    }
  }
}

async function main() {
  const server = await createServer({
    logger,
  })

  await server.start()

  server.ready(() => {
    showQRCode()
  })
}

main()
