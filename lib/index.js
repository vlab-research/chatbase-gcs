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

    return res
      .toString()
      .split('\n')
      .filter(x => !!x)
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
