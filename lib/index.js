const {Storage} = require('@google-cloud/storage')


class Chatbase {

  constructor (bucket = process.env.CHATBASE_BUCKET) {
    this.storage = new Storage()
    this.bucket = bucket
  }

  async get (key) {
    const exists = await this.storage
          .bucket(this.bucket)
          .file(key)
          .exists()

    if (!exists[0]) return

    const res = await this.storage
          .bucket(this.bucket)
          .file(key)
          .download()

    const li = res
          .toString()
          .split('\n')
          .filter(x => !!x)

    // unique because gcloud storage has no other deduplication
    return [... new Set(li)]
  }

  async put (key, value) {
    const prev = await this.get(key) || []
    const dat = [...prev, value].join('\n')

    return this.storage
      .bucket(this.bucket)
      .file(key)
      .save(dat, { resumeable: false })
  }

  async delete (key) {
    return this.storage
      .bucket(this.bucket)
      .file(key)
      .delete()
  }
}


// put for gcs...
module.exports = Chatbase
