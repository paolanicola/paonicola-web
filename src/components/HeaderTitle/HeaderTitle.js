import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getTotals } from '../../features/cart/cartSlice'

function HeaderTitle({ customTitle }) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTotals())
  }, [dispatch])

  function formatTitle(title) {
    if (title.length <= 3) {
      return title.toUpperCase()
    } else {
      return title
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  }

  const location = useLocation()
  const pattern = /^\/([^/]+)(?:\/|$)/ // grabs from the first slash until the second one if exists
  const match = location.pathname.match(pattern)
  let title = ''
  if (match) {
    title = match[1]
  }
  const formattedTitle = customTitle || formatTitle(title)

  return (
    <>
      {title !== 'home' && title !== '' && (
        <div className='encabezado__container'>
          <div className='encabezado__container-title'>
            <div className='title__container'>
              <h1 className='title__container-h1'>{formattedTitle}</h1>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HeaderTitle
