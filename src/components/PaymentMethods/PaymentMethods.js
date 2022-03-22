import React from 'react';

function PaymentMethods() {
  return (
    <div className='payment-container'>
      <h5 class='mb-20'>Seleccioná el método de pago</h5>

      <div className='medio-pago'>
        <input type='radio' id='transferencia' name='pago' value='transferencia' />
        <label for='transferencia' className='label-pago'>
          <h6 className='bold'>Transferencia Bancaria</h6>
          <div className='descripcion-pago'>
            <p>Realizá una transferencia al cbu que te indicaré al finalizar la compra. La compra se efectuará una vez que me envíes el comprobante de pago.</p>
          </div>
        </label>
      </div>

      <div className='medio-pago'>
        <input type='radio' id='tarjeta' name='pago' value='tarjeta' />
        <label for='tarjeta' className='label-pago'>
          <h6 class='bold'>
            Tarjeta de débito/crédito <span></span>
          </h6>
          <div class='descripcion-pago'>
            <p class='bold mb-10 mt-20'>Ingresá los datos de tu tarjeta.</p>

            <form action='' class='form'>
              <div class='form-group'>
                <label class='form-control-label' for='card_number'>
                  Número de Tarjeta *
                </label>
                <input class='form-control' required='required' type='number' name='card_number' id='card_number' />
              </div>
              <div class='row'>
                <div class='col-12 col-sm-6'>
                  <div class='form-group'>
                    <label class='form-control-label' for='card_expiration'>
                      Fecha de vencimiento *
                    </label>
                    <input class='form-control' required='required' type='text' name='card_expiration' id='card_expiration' placeholder='MM/AAAA' />
                  </div>
                </div>
                <div class='col-12 col-sm-6'>
                  <div class='form-group'>
                    <label class='form-control-label' for='card_code'>
                      Cód. de seguridad *
                    </label>
                    <input class='form-control' required='required' type='text' name='card_code' id='card_code' />
                  </div>
                </div>
              </div>
              <p class='bold mb-10 mt-20'>¿En cuántas cuotas querés pagar?</p>
              <div class='form-group'>
                <label class='form-control-label' for='cuotas'>
                  Número de cuotas*
                </label>
                <select required='required' type='number' name='cuotas' id='cuotas'>
                  <option value=''>1 de $1500</option>
                  <option value=''>3 de $500</option>
                  <option value=''>6 de $300</option>
                </select>
              </div>
            </form>
          </div>
        </label>
      </div>
    </div>
  );
}

export default PaymentMethods;
