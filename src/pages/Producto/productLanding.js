// El contenido de las páginas de producto ("Conocer más") vive en la BASE y
// lo edita Pao desde su admin (Productos → Página del producto). La API lo
// devuelve armado en `product.landing`; acá no hay nada hardcodeado.
export const getLanding = (product) => product?.landing || null

export default getLanding
