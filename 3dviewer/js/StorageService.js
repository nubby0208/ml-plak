class StorageService {
  constructor() {
  }

  getModelsFromVuex() {
    var modelsVuex = JSON.parse(window.localStorage.getItem('vuex'));
    let modelsVuexDict = {};
    let materialsDict = {};
    let modulesArray = modelsVuex.layout.modules;
    if(modelsVuex.layout.roomEditorModules) {
      modulesArray = modulesArray.concat(modelsVuex.layout.roomEditorModules);
    }
    modulesArray.forEach( (module) => {
      let tc = ( modelsVuex.general.tapacantos_default_por_modulo[module.moduleId - 1] !== undefined ) ?
        JSON.parse(modelsVuex.general.tapacantos_default_por_modulo[module.moduleId - 1]) : {};

      const material = modelsVuex.general.material_default_por_modulo[module.moduleId - 1];
      if(module.isRoomEditor && (module.moduleId % 100) !== 0) {
        module.moduleId *= 100;
      }
      let newModule = {
        moduleId: module.moduleId,
        depthMaterial: module.fondo,
        height: module.height,
        width: module.width,
        depth: module.z,
        description: module.settings.description,
        comment: module.settings.comentario,
        _x: module._x,
        _y: module._y,
        _z: module._z,
        rx: module._rx,
        ry: module._ry,
        rz: module._rz,
        defaultMaterial: !!material ? JSON.parse(material) : '',
        defaultTapacantos: tc ? tc.nombre : ''
      };
      modelsVuexDict[module.moduleId] = newModule;
    });

    return modelsVuexDict;
  }

  setModelPosition(modelId, pos) {
    var modelsVuex = JSON.parse(window.localStorage.getItem('vuex'));
    modelsVuex.layout.modules.forEach( (module) => {
      if (module.moduleId === modelId){
          module._x = pos.x;
          module._y = pos.y;
          module._z = pos.z;
      }
    });
    modelsVuex.layout.roomEditorModules.forEach( (module) => {
      if (module.moduleId === modelId || module.moduleId * 100 === modelId){
        module._x = pos.x;
        module._y = pos.y;
        module._z = pos.z;
      }
    });
    window.localStorage.setItem('vuex', JSON.stringify(modelsVuex));
  }

  setModelRotation(modelId, rot) {
    var modelsVuex = JSON.parse(window.localStorage.getItem('vuex'));
    modelsVuex.layout.modules.forEach( (module) => {
      if (module.moduleId === modelId){
        module._rx = rot.x;
        module._ry = rot.y;
        module._rz = rot.z;
      }
    });
    modelsVuex.layout.roomEditorModules.forEach( (module) => {
      if (module.moduleId === modelId || module.moduleId * 100 === modelId){
        module._rx = rot.x;
        module._ry = rot.y;
        module._rz = rot.z;
      }
    });
    window.localStorage.setItem('vuex', JSON.stringify(modelsVuex));
  }
}
