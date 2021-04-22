import { useState } from 'react';
import CSVReader from 'react-csv-reader'
import './App.css';
import NFTMinterABI from "./abi/TokamakNFTMinter.json"
import Web3 from 'web3';

let web3 = null;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    window.ethereum.enable().then(function() {
      console.log("Allowed");
    });
  } catch (e) {
    console.log({ e });
  }
}

const nftMinterAddress = '0x4aD610E6872Df1a8EF3B223c315ef080E5e200c5'
const contract = new web3.eth.Contract(
  NFTMinterABI.abi, nftMinterAddress
)

function App() {
  const [data, setData] = useState([])
  const [eventName, setEventName] = useState('event1')
  const [input, setInput] = useState('')
  const [selectValue, setSelectValue] = useState(['event1', 'event2', 'event3'])
  const [result, setResult] = useState([])
  const [err, setErr] = useState([])

  const listItems = data.map((rowData, index) => <div className="address-list"><li key={index}>{rowData}</li><button onClick={() => deleteRow(data, index)}>delete</button></div>)
  
  const selectItems = selectValue.map((rowData, index) => <option value={rowData}>{rowData}</option>)

  const controledSelectItems = selectValue.map((rowData, index) => <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}} value={rowData}>{rowData}<button onClick={() => deleteRow(selectValue, index)}>delete</button></div>)

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  const handleSelectChange = (e) => {
    setData([])
    setEventName(e.target.value)
  }

  const insertRow = () => {
    if (input === '') {
      return alert("Please input address")
    }
    setData([...data, input])
  }

  const deleteRow = (value, args) => {
    if (value === selectValue) {
      return setSelectValue(value.filter((d, index) => 
      index !== args
    ))
    }
    setData(value.filter((d, index) => 
      index !== args
    ))
  }
  
  const submit = async () => {
    if (data.length === 0) {
      return alert("Please put an address")
    }
    
    const confirmed = window.confirm("Are you sure?");
    if (confirmed === false) {
      return 
    }
    
    web3.eth.getAccounts().then(accounts => {
      console.log({ accounts });
      contract.methods.mintBatch(data, eventName).send({ from: accounts[0] }, (error, txResult) => {
        if (error) {
          alert(error)
        }
        setResult([...result, txResult]);
      }).on('error', (error) => {
        console.log(error)
        setErr([...err, 'Something is wrong. Please put F12 and check the error log'])
      })
        ;
    });
  }
  
  return (
    <div className="App">
      <h1 style={{color: '#167BBC'}}>Onther-NFT-page</h1>
      <div style={{ marginBottom: 40 }}>
        <div className="top-container">
        <h2>Address</h2>
          <CSVReader onFileLoaded={(data) => setData(data)}></CSVReader>
        </div>
        <input style={{ width: 400, height:40, marginRight: 10 }} onChange={handleChange}></input>
        <button style={{height:40, width: 100}} onClick={() => insertRow()}>Add</button>
      </div>
      <div className="data-area">
        <ol>
          {listItems}
        </ol>
      </div>
      <div className="btn-container">
        <div style={{ width: 250, display: 'flex', flexDirection: 'column' }}>
          <h2>Eventname-list</h2>
          <div style={{display: 'flex'} }>
          <input style={{marginRight: 10}}></input>
          <button>add</button>
          </div>
          <div style={{marginTop: 20}}>{controledSelectItems}</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <select style={{ width: 150, height: 40 }} onChange={handleSelectChange} >
          {selectItems}
        </select>
            <button className="btn-send" style={{ height: 40, width: 100 }} onClick={() => submit()}>Send</button>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>Result</h2>
            {result.length !== 0 ?  result.map(rowData => <a href={"https://rinkeby.etherscan.io/tx/" + rowData} target="_blank" rel="noreferrer noopener">
              {rowData.slice(0, 5) + "..." + rowData.slice(-5)}
            </a>) : ''}
            </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>Error</h2>
              {err.map(rowData => <span>{rowData}</span>)}
          </div>
          </div>
          </div>
        </div>
    </div>
  );
}

export default App;
