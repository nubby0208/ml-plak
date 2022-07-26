import Vue from 'vue'
import Router from 'vue-router'
import UserLogin from '../components/UserLogin.vue'
import Conexiones from '../components/Conexiones.vue'
import Asistencia from '../components/Taller/Asistencia.vue'
import Taller from '../components/Taller/Taller.vue'
import DesignStart from '../components/DesignDashboard/DesignStart.vue'
import DesignDashboard from '../components/DesignDashboard/Index.vue'
import Presupuestos from '../components/Taller/presupuestos/presupuestos.vue'
import Tareas from '../components/Taller/tarea/tarea.vue'
import Calendar from '../components/Taller/calendar/Calendar.vue'
import Tareacalendar from '../components/Taller/calendar/Tareacalendar.vue'
import Produccion from '../components/Taller/produccion-admin/Produccion-admin.vue'
import MiProduccion from '../components/Taller/miproduccion/Miproduccion.vue'
import Usuarios from '../components/Taller/usuarios/Usuarios.vue'
import Grupos from '../components/Taller/grupos/grupos.vue'
import Lasistencia from '../components/Taller/Lasistencia/Lasistencia.vue'
import Auditoria from '../components/Taller/auditoria/Auditoria.vue'
import Horario from '../components/Taller/horario/Horario.vue'
import PlanillaHoraria from '../components/Taller/horario/PlanillaHoraria.vue'
import Maquinas from '../components/Taller/maquinas/Maquinas.vue'
import CapacidadProduccion from '../components/Taller/capacidadproduccion/capacidadproduccion.vue'
import CapacidadProduccionHoraria from '../components/Taller/capacidadproduccion/capacidadproduccionhoraria.vue'
import TiemposTraslados from '../components/Taller/tiempostraslados/tiempostraslados.vue'
import Respaldo from '../components/Taller/respaldo/respaldo.vue'
import AdminImages from '../components/Taller/adminimages/adminimages.vue'
import Proyecto from '../components/Taller/proyecto/proyecto.vue'
import Materiales from '../components/Taller/materiales/materiales.vue'
import Reportes from '../components/Taller/reportes/reportes.vue'
import ReportesFinalizados from '../components/Taller/reportes/reportes_finalizados.vue'
import Estados from '../components/Estados.vue'
import Compras from '../components/Taller/compras/Compras.vue'
import ClientView from '../components/Taller/ClientView/ClientView.vue'
import ClientViewSequence from '../components/Taller/ClientView/ClientViewSequence.vue'
import ClientViewExecutor from '../components/Taller/ClientView/ClientViewExecutor.vue'
import ClientViewStorage from '../components/Taller/ClientView/ClientViewStorage.vue'
import PreguntaExportar from '../components/PreguntaExportar.vue'
import PreguntaVender from '../components/PreguntaVender.vue'
import Loginlog from '../components/Taller/Loginlog/index.vue'
import NotificationModules from '../components/Taller/notification/Notification.vue'
import Help from '../components/Taller/help/Help.vue'
import HelpMe from '../components/Taller/help/HelpMe.vue'
Vue.use(Router)


const router = new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'DesignDashboard'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/Conexiones',
      name: 'Conexiones',
      component: Conexiones
    },
    {
      path: '/pregunta-exportar',
      name: 'PreguntaExportar',
      component: PreguntaExportar
    },
    {
      path: '/pregunta-vender',
      name: 'PreguntaVender',
      component: PreguntaVender
    },
    {
      path: '/design-start',
      name: 'DesignStart',
      component: DesignStart
    },
    {
      path: '/design-dashboard',
      name: 'DesignDashboard',
      component: DesignDashboard
    },
    {
      path: '/Asistencia',
      name: 'Asistencia',
      component: Asistencia
    },
    {
      path: '/Taller',
      name: 'Taller',
      component: Taller
    },
    {
      path: '/Presupuestos',
      name: 'Presupuestos',
      component: Presupuestos
    },
    {
      path: '/Tareas',
      name: 'Tareas',
      component: Tareas
    },
    {
      path: '/Calendar',
      name: 'Calendario',
      component: Calendar
    },
    {
      path: '/Tareacalendar',
      name: 'Tareas',
      component: Tareacalendar
    },
    {
      path: '/ReportesFinalizados',
      name: 'Reportes Finalizados',
      component: ReportesFinalizados
    },
    {
      path: '/Notification',
      name: 'Notificaciones',
      component: NotificationModules
    },
     
    {
      path: '/Help',
      name: 'Ayuda',
      component: Help
    },

    {
      path: '/HelpMe',
      name: 'Ayúdame',
      component: HelpMe
    },

    {
      path: '/produccion',
      name: 'Producción',
      component: Produccion
    },
    {
      path: '/MiProduccion',
      name: 'Mi Producción',
      component: MiProduccion
    },
    {
      path: '/Usuarios',
      name: 'Usuarios',
      component: Usuarios
    },
    {
      path: '/Grupos',
      name: 'Grupos',
      component: Grupos
    },
    {
      path: '/Lasistencia',
      name: 'Mi sueldo',
      component: Lasistencia
    },
    {
      path: '/Auditoria',
      name: 'Auditoria',
      component: Auditoria
    },
    {
      path: '/Horario',
      name: 'Horarios',
      component: Horario
    },
    {
      path: '/PlanillaHoraria',
      name: 'PlanillaHoraria',
      component: PlanillaHoraria
    },
    {
      path: '/Maquinas',
      name: 'Maquinas',
      component: Maquinas
    },
    {
      path: '/capacidadproduccion',
      name: 'capacidadproduccion',
      component: CapacidadProduccion
    },
    {
      path: '/capacidadproduccionhoraria',
      name: 'capacidadproduccionhoraria',
      component: CapacidadProduccionHoraria
    },
    {
      path: '/tiempostraslados',
      name: 'tiempostraslados',
      component: TiemposTraslados
    },
    {
      path: '/respaldo',
      name: 'Respaldo',
      component: Respaldo
    },
    {
      path: '/adminimages',
      name: 'adminimages',
      component: AdminImages
    },
    {
      path: '/proyecto',
      name: 'Proyecto',
      component: Proyecto
    },
    {
      path: '/materiales',
      name: 'Materiales',
      component: Materiales
    },
    {
      path: '/reportes',
      name: 'Reportes',
      component: Reportes
    },
    {
      path: '/estados',
      name: 'estados',
      component: Estados
    },
    {
      path: '/compras',
      name: 'Compras',
      component: Compras
    },
    {
      path: '/clientView',
      name: 'clientView',
      component: ClientView
    },
    {
      path: '/clientViewSequence',
      name: 'clientViewSequence',
      component: ClientViewSequence
    },
    {
      path: '/clientShow/:id',
      name: 'clientShow',
      component: ClientViewExecutor,
      meta: {
        notLogin: true
      }
    },
    {
      path: '/clientViewStorage',
      name: 'Resultados Secuencia Clientes',
      component: ClientViewStorage
    },
    {
      path: '/loginlog',
      name: 'Historial de entradas al sistema',
      component: Loginlog
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const loginPath = '/login'
  if (to.meta && to.meta.notLogin) {
    next()
    return
  }
  if (to.path !== loginPath && !localStorage.getItem('token')) {
    next({
      path: loginPath
    })
    return
  }
  next()
})

export default router
