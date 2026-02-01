import mongoose from "mongoose"

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  args.forEach((a, i) => {
    if (a.startsWith("--")) {
      const key = a.slice(2)
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true
      out[key] = val
    }
  })
  return out
}

const { source, target, drop = 'true' } = parseArgs()

if (!source || !target) {
  console.error("Usage: node migrate_db.js --source <sourceUri> --target <targetUri> [--drop true|false]")
  process.exit(1)
}

const doDrop = drop === 'true' || drop === true

async function migrate() {
  console.log("Connecting to source:", source)
  console.log("Connecting to target:", target)

  const srcConn = await mongoose.createConnection(source, { dbName: undefined })
  const tgtConn = await mongoose.createConnection(target, { dbName: undefined })

  try {
    const cols = await srcConn.db.listCollections().toArray()
    for (const c of cols) {
      const name = c.name
      if (name.startsWith('system.')) continue
      console.log(`Migrating collection: ${name}`)

      const srcColl = srcConn.db.collection(name)
      const tgtColl = tgtConn.db.collection(name)

      if (doDrop) {
        try {
          await tgtColl.drop()
          console.log(`Dropped existing target collection ${name}`)
        } catch (err) {
          // ignore if doesn't exist
        }
      }

      const docs = await srcColl.find().toArray()
      if (docs.length === 0) {
        console.log(`  - no documents to migrate for ${name}`)
        continue
      }

      // Insert documents preserving _id
      // If duplicate key errors happen, consider drop=false
      await tgtColl.insertMany(docs)
      console.log(`  - inserted ${docs.length} documents into ${name}`)
    }

    console.log('Migration complete')
  } finally {
    await srcConn.close()
    await tgtConn.close()
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
