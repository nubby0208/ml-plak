import { HTTP } from '../../../index'

export default class action_noteService{
  async getAll(proyecto_id) {
    let result = await HTTP.get(`/api/action_notes/${proyecto_id}`);
    return result.data
  }

  async update(note) {
    let id = note.id;
    let result = await HTTP.put(`/api/action_notes/${id}`, note);
    return result.data.actionnote.estado_id
}

}
