// El contenido de las páginas de producto ("Conocer más") vive en la BASE y
// lo edita Pao desde su admin (Productos → Página del producto). La API lo
// devuelve armado en `product.landing`; acá no hay nada hardcodeado.
// Ojo: la API nunca manda `landing: null`. Para los productos sin página
// propia manda el molde vacío (`{ kicker: '', headline: '', sticky: false }`),
// que es truthy. Sin este chequeo esos productos entraban igual a la rama de
// landing y quedaban con un <h1> vacío, sin precio y sin botón de compra
// (pasaba en producción con los dos descargables gratuitos, 2026-07-19).
// El headline es el <h1> del hero: sin él no hay landing que mostrar.
export const getLanding = (product) =>
  product?.landing?.headline?.trim() ? product.landing : null

export default getLanding
