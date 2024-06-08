import React, { useState } from 'react'

export default function AccountSecret({ accountSecretDetail, rowSL, secretNumber, rows, setRows }) {
  //const [accountSecretDetail,setAccountSecretDetail]=useState("")
  console.log(accountSecretDetail)
  const handleInputChange = (event) => {
    accountSecretDetail = event.target.value
    const currentRow = rows[rowSL - 1]
    currentRow.accountSecretDetails[secretNumber] = accountSecretDetail
    rows[rowSL - 1] = currentRow
    setRows([...rows])
  }
  return (
    <textarea className='form-control my-2' required value={accountSecretDetail} placeholder='Account Secret' name='accountSecretDetail' onChange={handleInputChange} />
  )
}
