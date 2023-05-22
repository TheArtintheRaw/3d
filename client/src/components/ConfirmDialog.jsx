import React from 'react'

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000
        }}
        onClick={onCancel}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '20px',
          zIndex: 1001,
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
        }}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button style={{ marginRight: '10px' }} onClick={onConfirm}>
          Yes
        </button>
        <button onClick={onCancel}>No</button>
      </div>
    </>
  )
}

export default ConfirmDialog
