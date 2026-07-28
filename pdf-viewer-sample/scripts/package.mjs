import { createWriteStream } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { ZipArchive } from 'archiver'

const cwd = process.cwd()
const pluginName = basename(cwd)

function createZip(sourceDir, archivePath) {
  return new Promise((resolveArchive, rejectArchive) => {
    const output = createWriteStream(archivePath)
    const archive = new ZipArchive({ zlib: { level: 9 } })

    output.on('close', resolveArchive)
    output.on('error', rejectArchive)
    archive.on('error', rejectArchive)

    archive.pipe(output)
    archive.directory(sourceDir, '', { name: '' })
    archive.finalize().catch(rejectArchive)
  })
}

async function main() {
  const buildDir = join(cwd, 'dist')
  const packageJson = JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8'))
  const archiveName = `${pluginName}-v${packageJson.version}.zip`
  const archivePath = resolve(cwd, archiveName)

  console.log(`Creating archive ${archiveName}`)
  await rm(archivePath, { force: true })

  await createZip(buildDir, archivePath)

  console.log(`Done: ${archivePath}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
