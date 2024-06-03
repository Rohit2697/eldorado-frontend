import React, { useState, useEffect } from 'react'
import api from '../utils/api';
import FormData from 'form-data';
import imageName from '../utils/imageName';
export default function SellerTableRow({ rowSL, reduceRow, row, rows, games, setRows }) {
  const [gameSelected, setGameSelected] = useState(false)
  const [gameInfo, setGameinfo] = useState({})
  const [disableFields, setDisableFileds] = useState({
    tradeEnvironmentId: true,
    attributeIdsCsv: true,
    mainOfferImage: true
  })
  //const [, setHasImage] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const [guaranteedDeliveryTime] = useState([{
    value: "Instant",
    label: "Instant"
  }, {

    value: "Minute10",
    label: "10 Minutes"
  },
  {
    value: "Minute15",
    label: "15 Minutes"
  },
  {
    value: "Minute20",
    label: "20 Minutes"
  },
  {
    value: "Hour1",
    label: "1 Hour"
  },
  {
    value: "Hour2",
    label: "2 Hour"
  },
  ])


  useEffect(() => {
    if (!selectedImage) return
    const data = new FormData()
    data.append('image', selectedImage)
    api.post('/image', data, {
      maxBodyLength: Infinity

    }).then(res => {
      const newRows = rows
      rows[rowSL - 1] = {
        ...rows[rowSL - 1],
        mainOfferImage: {
          "smallImage": imageName(res.data.localPaths[0]),
          "largeImage": imageName(res.data.localPaths[1]),
          "originalSizeImage": imageName(res.data.localPaths[2])
        }
      }
      console.log(rows[rowSL - 1])
      setRows(newRows)
    }).catch(err => {
      console.log(err)
      alert('Unable to upload Image')
      setSelectedImage(null)
    })
  }, [selectedImage])
  useEffect(() => {
    if (!gameSelected) return
    const newDisabledFields = { ...disableFields }
    for (let key in newDisabledFields) {
      newDisabledFields[key] = true
    }
    setDisableFileds(newDisabledFields)
    api.get(`/getTradeEnv?itemTreeType=Account&gameId=${games.find(game => game.itemTreeID === row.itemId).gameId}`).then(res => {
      const game = res.data;
      console.log(game)
      if (!game.imageLocation) newDisabledFields.mainOfferImage = false
      if (game.tradeEnvironments.length) newDisabledFields.tradeEnvironmentId = false
      if (game.attributes.length && game.attributes[0].attributeValues.length) newDisabledFields.attributeIdsCsv = false
      setGameinfo(game)
      setDisableFileds(newDisabledFields)
      setGameSelected(false)
      //setDisableFileds({...disableFields,})

    }).catch(err => {
      console.log(err)
      setGameSelected(false)
      alert("This game can't be selected")
    })

  }, [gameSelected])
  const handleInputChange = (event) => {
    if (event.target.name === 'itemId') {
      setGameSelected(true)
    }
    else if (event.target.name === 'mainOfferImage') {
      const file = event.target.files[0];
      if (file) {
        return setSelectedImage(file);
      }
    }
    const newRows = rows.map((row, i) => {
      if (i === rowSL - 1) {
        return { ...row, [event.target.name]: event.target.value };
      }
      return row;
    });
    setRows(newRows);
  }

  const handleReduceClick = () => {
    reduceRow(rowSL - 1)
  }
  return (
    <tr>
      <button className='btn btn-danger' type="button" onClick={handleReduceClick}>-</button>
      <th scope="row" className="table-light">{rowSL}</th>
      <td className="table-light">
        <select
          name="itemId"
          value={row.itemId}
          onChange={handleInputChange}
          required
          className='form-select form-select-sm'

        >
          <option value="" disabled>Select an option</option>
          {games.map((game) => (
            <option key={game.gameId} value={game.itemTreeID}>
              {game.gameName}
            </option>
          ))}
        </select>
      </td>
      <td className="table-light">
        <select
          name="tradeEnvironmentId"
          value={row.tradeEnvironmentId}
          onChange={handleInputChange}
          disabled={disableFields.tradeEnvironmentId}
          required={!disableFields.tradeEnvironmentId}
          className='form-select form-select-sm'
        >
          <option value="">Select an Environment</option>
          {!disableFields.tradeEnvironmentId && gameInfo.tradeEnvironments.map((tradeEnv) => (
            <option key={tradeEnv.id} value={tradeEnv.id}>
              {tradeEnv.value}
            </option>
          ))}
        </select>
      </td>
      <td className="table-light">
        <select
          name="guaranteedDeliveryTime"
          value={row.guaranteedDeliveryTime}
          required
          onChange={handleInputChange}
          className='form-select form-select-sm'

        >
          <option value="">Select Delivery Time</option>
          {guaranteedDeliveryTime.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
      <td className="table-light">
        <input className='form-control' min="1" type='number' value={row.quantity} name='quantity' onChange={handleInputChange} />
      </td>
      <td className="table-light">
        <input className='form-control' required type='text' value={row.amount} placeholder='amount in USD' name='amount' onChange={handleInputChange} />
      </td>
      <td className="table-light">
        <textarea className='form-control' required value={row.offerTitle} placeholder='Game Title' name='offerTitle' onChange={handleInputChange} />
      </td>
      <td className="table-light">
        <select
          name="attributeIdsCsv"
          value={row.attributeIdsCsv}
          onChange={handleInputChange}
          disabled={disableFields.attributeIdsCsv}
          required={!disableFields.attributeIdsCsv}
          className='form-select form-select-sm'
        >
          <option value="">Select Game Rank</option>
          {!disableFields.attributeIdsCsv && gameInfo.attributes[0].attributeValues.map((attribute, index) => (
            <option key={attribute.attributeValueId} value={attribute.attributeValueId}>
              {attribute.name}
            </option>
          ))}
        </select>
      </td>
      <td className="table-light">
        <input className='form-control' required={!disableFields.mainOfferImage} type="file" disabled={disableFields.mainOfferImage} placeholder='Game Image' name='mainOfferImage' onChange={handleInputChange} />

      </td>
      <td className="table-light">
        <textarea className='form-control' required value={row.description} placeholder='Game Description' name='description' onChange={handleInputChange} />
      </td>
      <td className="table-light">
        <textarea className='form-control' required value={row.accountSecretDetails} placeholder='Account Secret' name='accountSecretDetails' onChange={handleInputChange} />
      </td>
    </tr>
  );
}
