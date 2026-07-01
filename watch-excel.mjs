import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const excelPath = path.join(__dirname, 'Sample_Sales_Data_MVP_Extended.xlsx')

console.log('👀 Watching for Excel file changes...')

let server

async function startVite() {
  server = await createServer({
    root: __dirname,
    server: { port: 3000, host: true },
  })
  await server.listen()
  console.log(`🚀 Dashboard running at http://localhost:${server.config.server.port}`)
}

fs.watchFile(excelPath, { interval: 1000 }, (curr, prev) => {
  if (curr.mtime > prev.mtime) {
    console.log('📄 Excel file changed, triggering hot reload...')
    if (server) {
      server.ws.send({ type: 'custom', event: 'excel-changed' })
    }
  }
})

startVite()
