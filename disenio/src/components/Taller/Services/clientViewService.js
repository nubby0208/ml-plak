import { HTTP } from '../../../index'

export default class ClientViewService {
  async getList (page = 1, total = 1, search = '') {
    let result = await HTTP.get(`api/clients/views?total=${total}&page=${page}&search=${search}`)
    return result.data
  }

  async getTemplateList () {
    let result = await HTTP.get(`api/clients/templates`)
    return result.data
  }

  async delete (id) {
    let result = await HTTP.delete(`api/clients/views/${id}`)
    return result.data
  }

  async store (view) {
    let result = await HTTP.post(`api/clients/views`, view)
    return result.data
  }

  async update (view) {
    let id = view.id
    let result = await HTTP.put(`api/clients/views/${id}`, view)
    return result.data
  }

  async uploadFieldsValues (view) {
    let formData = new FormData()
    let fileExist = false
    for (let key in view.fieldsValues) {
      if (view.fieldsValues[key].type === 'file' &&
        view.fieldsValues[key].files) {
        for (let i = 0; i < view.fieldsValues[key].files.length; i++) {
          let file = view.fieldsValues[key].files[i]
          formData.append(key + '[' + i + ']', file)
          fileExist = true
        }
        delete view.fieldsValues[key].files
      }
      if (view.fieldsValues[key].type === 'typeMultiFileAndText') {
        for (let i = 0; i < view.fieldsValues[key].value.length; i++) {
          if (view.fieldsValues[key].value[i].file) {
            let file = view.fieldsValues[key].value[i].file
            formData.append(key + '__' + i + '__[0]', file)
            fileExist = true
            delete view.fieldsValues[key].value[i].file
          }
        }
      }
    }
    if (fileExist) {
      let result = await HTTP.post('api/clients/upload', formData)
      return result.data
    }
    return null
  }

  // Sequence logic

  async getSequenceList (page = 1, total = 1, search = '') {
    let result = await HTTP.get(`api/clients/sequence?total=${total}&page=${page}&search=${search}`)
    return result.data
  }

  async storeSequence (sequence) {
    let result = await HTTP.post(`api/clients/sequence`, sequence)
    return result.data
  }

  async deleteSequence (id) {
    let result = await HTTP.delete(`api/clients/sequence/${id}`)
    return result.data
  }

  async detailSequence (id) {
    let result = await HTTP.get(`api/clients/sequence/${id}`)
    if (result.data) {
      this.createTreeParentRelation(result.data.sequence.sequenceTree)
      if (Array.isArray(result.data.views)) result.data.views = {}
    }
    return result.data
  }

  createTreeParentRelation (tree) {
    if (tree) {
      for (let i = 0; i < tree.children.length; i++) {
        tree.children[i].parent = tree
        this.createTreeParentRelation(tree.children[i])
      }
    } else {
      tree = undefined
    }
  }

  getTreeByKey (tree, key) {
    if (tree) {
      if (tree.key === key) return tree
      let result
      for (let i = 0; i < tree.children.length; i++) {
        result = this.getTreeByKey(tree.children[i], key)
        if (result) return result
      }
    }
    return undefined
  }

  async updateSequence (sequence) {
    let id = sequence.id
    let result = await HTTP.put(`api/clients/sequence/${id}`, sequence)
    return result.data
  }

  async publishSequence (id, publish) {
    let result = await HTTP.post(`api/clients/sequence/publish/${id}`, publish)
    return result.data
  }

  // Storage data logic

  async storeData (dataStorage) {
    let result = await HTTP.post(`api/sequence/store`, dataStorage)
    return result.data
  }

  async updateData (dataStorage) {
    let id = dataStorage.id
    let result = await HTTP.put(`api/clients/dataStorage/${id}`, dataStorage)
    return result.data
  }

  async detailData (id, view = undefined) {
    let url
    if (view) {
      url = `api/clients/dataStorage/${id}?view=true`
    } else {
      url = `api/clients/dataStorage/${id}`
    }
    let result = await HTTP.get(url)
    return result.data
  }

  async getDataList (page = 1, total = 1, search = '', status = '') {
    let result = await HTTP.get(`api/clients/dataStorage?total=${total}&page=${page}&search=${search}&status=${status}`)
    return result.data
  }

  async uploadTempFiles (files, fliesSendingInfo) {
    let formData = new FormData()
    let fileExist = false
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      formData.append('uploadFile' + '[' + i + ']', file)
      fileExist = true
    }
    if (fileExist) {
      let result = await HTTP.post('api/clients/upload', formData, {
        onUploadProgress: function (e) {
          console.log(e)
          fliesSendingInfo.total = e.total
          fliesSendingInfo.send = e.loaded
          fliesSendingInfo.percent = parseInt(Math.round( ( e.loaded / e.total) * 100))
        }.bind(fliesSendingInfo)
      })
      return result.data
    }
    return null
  }

  async updateDataInfo (id, info, status) {
    let result = await HTTP.put(`api/clients/dataStorage/${id}/info`,
      {info: info, status: status})
    return result.data
  }

  async updateDataStatus (id, status) {
    let result = await HTTP.put(`api/clients/dataStorage/${id}/status`,
      {status: status})
    return result.data
  }

  async uploadFile (id, files) {
    let formData = new FormData()
    let fileExist = false
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      formData.append('uploadFile' + '[' + i + ']', file)
      fileExist = true
    }
    if (fileExist) {
      let result = await HTTP.post(`api/clients/dataStorage/${id}/upload`, formData)
      return result.data
    }
    return []
  }

  async delteFile (id, fileName) {
    let result = await HTTP.delete(`api/clients/dataStorage/${id}/upload`,
      {fileName: fileName})
    return result.data
  }

  async createManualData (dataStorage) {
    let result = await HTTP.post(`api/clients/dataStorage`, dataStorage)
    return result.data
  }
}
