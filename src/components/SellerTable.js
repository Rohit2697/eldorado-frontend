
import React, { useState, useEffect } from 'react'
import SellerTableRow from './SellerTableR̥ow'
import sortByGmaeName from '../utils/sortGames';
import api from '../utils/api';
import './SellerTable.css'
export default function SellerTable() {

  const rowData = {
    tradeEnvironmentId: '',
    guaranteedDeliveryTime: '',
    itemId: '', quantity: 1,
    amount: '', description: '',
    offerTitle: '', attributeIdsCsv: '',
    accountSecretDetails: ''
  }
  const [games, setGames] = useState([])
  const [tableLoading, setTableLoading] = useState(true);


  const [rows, setRows] = useState([rowData]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data: games } = await api.get('/getgames/Account')
        console.log(games)
        setGames(sortByGmaeName(games));
        setTableLoading(false);
      } catch (error) {
        console.error('Error fetching options:', error);
        setTableLoading(false); // Even in case of error, stop loading to allow retry
      }
    };

    fetchGames();
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(rows)
    api.post('/sellOrders', rows).then((res) => {
      alert("data has been stored")
      setRows([rowData])
    }).catch(err => {
      alert("Unable to load data")
    })
  };
  const addRow = () => {
    setRows([...rows, rowData]);
  };
  const reduceRow = (rowNumber) => {
    // let newRows = rows

    console.log(rowNumber)

    // newRows.pop()
    // console.log(newRows)

    // setRows([...newRows])
  }
  if (tableLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table className="table table-hover">

          <thead>
            <tr>
              <th scope='col'></th>
              <th scope='col'>ID</th>
              <th scope='col'>Game Name</th>
              <th scope='col'>Trade Environment</th>
              <th scope='col'>Delivery Time</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Amount</th>
              <th scope='col'>Game Title</th>
              <th scope='col'>Game Rank</th>
              <th scope='col'>Game Image</th>
              <th scope='col'>Description</th>
              <th scope='col'>Account Secret</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              return (


                < SellerTableRow reduceRow={reduceRow} rowSL={index + 1} row={row} rows={rows} key={index} games={games} setRows={setRows} />

              )
            })}

          </tbody>
        </table>
        <div className='m-3 action-buttons'>
          <button className='btn btn-success' type="button" onClick={addRow} disabled={tableLoading}>+</button>

          <button className='btn btn-primary' type="submit" disabled={tableLoading}>Submit</button>
        </div>
      </form>

    </div>
  )
}
