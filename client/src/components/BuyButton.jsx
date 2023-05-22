import React from 'react'

function BuyButton({ type, title, customStyles, handleClick }) {
  const buttonStyles = `inline-flex items-center justify-center border border-transparent rounded-md font-medium text-white ${customStyles}`

  const filledStyles = 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  const outlinedStyles = 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-800 focus:ring-gray-500'

  const buttonType = type === 'filled' ? filledStyles : outlinedStyles

  return (
    <button type="button" className={`${buttonStyles} ${buttonType}`} onClick={handleClick}>
      {title}
    </button>
  )
}

export default BuyButton
