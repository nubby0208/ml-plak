/* lista de placeholders que estan disponibles en el editor de mensajes */
const PLACEHOLDERS = [
    {
        key: '!precio-premium!',
        value: '$37.400',
        description: 'El valor del mueble linea Premium.'
    },
    {
        key: '!precio-clasica!',
        value: '$15.000',
        description: 'El valor del mueble linea Clasica.'
    },
    {
        key: '!mlplak!',
        value: 'MLPLAK',
        description: 'El texto "ML PLAK".'
    },
    {
        key: '!cuotas!',
        value: `
      3 cuotas de $6888				 $20.664,74
      6 cuotas de $3583				 $21.495,30	
      `,
        description: 'La financiacion disponible.'
    },
    {
        key: '!instalacion-villaelisa!',
        value: '$450',
        description: 'El costo de instalacion en Villa Elisa.'
    },
    {
        key: '!instalacion!',
        value: '$350',
        description: 'El costo de instalacion en City Bell / Sicardi / Los Hornos.'
    },
    {
        key: '!instalacion-texto!',
        value: `
        Costos de instalacion: 					
        dentro de La Plata la Instalacion y translado Ya estan incluidos en el presupuesto					
        City Bell / Sicardi / Los Hornos !instalacion!					
        Villa Elisa !instalacion-villaelisa!
      `,
        description: 'El texto que describe los costos de instalacion.'
    },
    {
        key: '!alto!',
        value: '2100mm',
        description: 'El alto del mueble.'
    },
    {
        key: '!ancho!',
        value: '1500mm',
        description: 'El ancho del mueble.'
    },
    {
        key: '!prof!',
        value: '500mm',
        description: 'La profundidad del mueble.'
    },
    {
        key: '!mapa!',
        value: 'https://goo.gl/maps/439ejayXLPJ2',
        description: 'Link a Google Maps con la ubicacion de ML PLAK.'
    },
    {
        key: '!telefono!',
        value: '221 617 52 90',
        description: 'Telefono atencion al publico.'
    },
    {
        key: '!direccion!',
        value: 'Diag 620 e 83 y 84 ( casi 117 y 83 )',
        description: 'Direccion de ML PLAK.'
    },
    {
        key: '!horario!',
        value: 'Atencion de Lunes a Viernes de 9 :30 a 17:30HS',
        description: 'El horario de atencion al publico.'
    },
    {
        key: '!firma!',
        value: `
    !mlplak!
    !telefono!
    !direccion!
    !horario!
    !mapa!
      `,
        description: 'La firma del mensaje.'
    }
]

export default PLACEHOLDERS;
