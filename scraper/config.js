export const CONFIG = {
  // Fallback: se usa solo si no hay credentials.json (modo manual)
  usuario: '',
  password: '',

  // URL base del Backoffice — se reemplaza con el usuario real de credentials.json
  urlLogin: 'https://backoffice.niceonline.com/__usuario__/Account/Login',
  urlAfiliados: 'https://backoffice.niceonline.com/__usuario__/BackOffice/Affiliates',

  // Ruta de descargas (relativa al scraper/)
  carpetaDescargas: './downloads',

  // Ruta del HTML — relativa al scraper/ (funciona en cualquier PC)
  abrirApp: true,
  rutaApp: '../RedNICE.html',
}
