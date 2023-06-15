import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTotals } from '../../features/cart/cartSlice'

export default function ConfirmSale() {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(getTotals())
  }, [cart])

  return (
    <>
      <section className='confirm'>
        <h3 className='confirm__h3'>¡Tu compra fue realizada con éxito!</h3>
        <div className='confirm__data-sale'>
          <div className='data__nro '>
            <h6 className='data__nro-title'>NÚMERO DE PEDIDO:</h6>
            <h4 className='data__nro-number'>#523456</h4>
          </div>
          <ul className='data__list'>
            <li className='data__list-li'>
              <p className='data__list-title'>Fecha DE COMPRA</p>
              <p className='data__list-description'>26 de enero de 2021</p>
            </li>
            <li className='data__list-li'>
              <p className='data__list-title'>FECHA DEL TURNO</p>
              <p className='data__list-description'>
                20 de febrero de 2021 - 15:30hs
              </p>
            </li>
            <li className='data__list-li'>
              <p className='data__list-title'>EMAIL</p>
              <p className='data__list-description'>loremipsum@gmail.com</p>
            </li>
            <li className='data__list-li'>
              <p className='data__list-title'>Total</p>
              <p className='data__list-description'>$1652,00</p>
            </li>
            <li className='data__list-li-not'>
              <p className='data__list-title'>método de pago</p>
              <p className='data__list-description'>Transferencia bancaria</p>
            </li>
          </ul>
        </div>
        <div className='confirm__data-transfer'>
          <p className='data__transfer-title '>
            Para hacer efectiva tu compra, realizá el pago la siguiente cuenta:
          </p>
          <h6 className='data__transfer-cbu'>
            CBU: 0000123456789123 / Alias test.test.test <br />
            Titular: Paola Nicola <br />
            Banco Provincia <br />
          </h6>
          <h5 className='data__transfer-text-important '>
            IMPORTANTE: Si no recibís un e-mail de confirmación, por favor,
            revisá tu casilla de spam.
            <br />
            Ante cualquier inconveniente, escribime a
            <a href='mailto:' className='data__transfer-email'>
              EMAIL
            </a>
          </h5>
        </div>
        <div className='confirm__data-details'>
          <h3 className='data__details-title'>Detalles de tu compra</h3>
          <div className='data__details-buyer'>
            <div className='details__buyer-cart'>
              <div className='carrito-total-container2'>
                <h5 className='carrito-total-titulo2'>Total del carrito</h5>

                <table
                  className='carrito-total-items2'
                  cellpadding='0'
                  cellspacing='0'
                >
                  <tr className='carrito-total-item2'>
                    <td className='carrito-total-item-name2'>
                      Guia plan general hacia una alimentacion saludable
                    </td>
                    <td className='carrito-total-item-price2 text-right'>
                      $1652
                    </td>
                  </tr>
                  <tr className='carrito-total-item2'>
                    <td className='carrito-total-item-name2'>
                      Guia plan general
                    </td>
                    <td className='carrito-total-item-price2 text-right'>
                      $9052
                    </td>
                  </tr>
                  <tr className='carrito-total-item2'>
                    <td className='carrito-total-item-name2'>
                      {' '}
                      Alimentacion saludable
                    </td>
                    <td className='carrito-total-item-price2 text-right'>
                      $1782
                    </td>
                  </tr>
                  <tr className='carrito-total-item2'>
                    <td className='carrito-total-item-name2'>
                      {' '}
                      Plan general saludable
                    </td>
                    <td className='carrito-total-item-price2 text-right'>
                      $1652
                    </td>
                  </tr>
                  <tr>
                    <td className='carrito-total-ch-td2'></td>
                  </tr>
                  <tr className='carrito-resume2'>
                    <td className='carrito-resume-title2'>Total</td>
                    <td className='carrito-resume-price2 text-right'> $2050</td>
                  </tr>
                </table>
              </div>
            </div>
            <div className='details__buyer-contact'>
              <div className='buyer__contact-container'>
                <h5 className='buyer__contact-container-h5'>
                  Datos personales
                </h5>
                <p className='buyer__contact-container-p'>
                  Nombre: <b>Nombre Apellido</b>
                </p>
                <p className='buyer__contact-container-p'>
                  E-mail: <b>email@email.com</b>
                </p>
                <p className='buyer__contact-container-p'>
                  Teléfono: <b>2216451259</b>
                </p>
                <p className='buyer__contact-container-clarify'>
                  Si alguno de estos datos son incorrectos, escribime a
                  <a className='' href='mailto:'>
                    [EMAIL]
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
