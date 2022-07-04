import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ReactComponent as CalendarSvg } from '../../assets/images/tienda/calendar.svg'
import { ReactComponent as UserSvg } from '../../assets/images/tienda/user.svg'
import { ReactComponent as CreditCardSvg } from '../../assets/images/tienda/credit-card.svg'

function Steps() {
  const { step } = useSelector((state) => state.step)

  return (
    <div className=''>
      <div class='wizard'>
        <div class='wizard-header'>
          <div class='steps text-center'>
            <div
              className={
                step === 0 ? 'wizard-step wizard-step-01 active' : 'wizard-step wizard-step-01'
              }
            >
              <div class='icon-stepper'>
                <CalendarSvg />
              </div>
              <div class='text-stepper'>
                <p class='mb-0'>
                  <small>PASO 1</small>
                </p>
                <p>Elegí tu turno</p>
              </div>
            </div>
            <div
              className={
                step === 1 ? 'wizard-step wizard-step-02 active' : 'wizard-step wizard-step-02'
              }
            >
              <div class='icon-stepper'>
                <UserSvg />
              </div>
              <div class='text-stepper'>
                <p class='mb-0'>
                  <small>PASO 2</small>
                </p>
                <p>Tus datos</p>
              </div>
            </div>
            <div
              className={
                step === 2 ? 'wizard-step wizard-step-03 active' : 'wizard-step wizard-step-03'
              }
            >
              <div class='icon-stepper'>
                <CreditCardSvg />
              </div>
              <div class='text-stepper'>
                <p class='mb-0'>
                  <small>PASO 3</small>
                </p>
                <p>Opciones de pago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Steps
