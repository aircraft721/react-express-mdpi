import React, { useState, useEffect } from 'react';
import './App.css';
import Add from './assets/add.png';
import Minus from './assets/minus.png';

function App() {
  const [data, setData] = useState()
  const [googleScholarLabel, setGoogleScholarLabel] = useState('');
  const [googleScholarOtherParams, setGoogleScholarOtherParams] = useState([]);

  const addNewFields = () => {
    const googleScholarOtherParamsClone = [...googleScholarOtherParams];
    googleScholarOtherParamsClone.push({text: ''})
    setGoogleScholarOtherParams(googleScholarOtherParamsClone);
  }

  const removeFields = (i) => {
      const googleScholarOtherParamsClone = [...googleScholarOtherParams];
      googleScholarOtherParamsClone.splice(i, 1);
      setGoogleScholarOtherParams(googleScholarOtherParamsClone);
  }

  const setOtherParams = (event, index) => {
    const arr = [...googleScholarOtherParams];
    arr[index].text = event;
    setGoogleScholarOtherParams(arr);
  }

  const buildUrl = `https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors=${googleScholarLabel}${googleScholarOtherParams.length > 0 ? `+-${googleScholarOtherParams.map(value => value.text).join('+-')}` : ''}`

  // useEffect(() => {
  //   async function fetchData() {
  //     const fetchData = 
  //       await fetch('http://localhost:8001/', {
  //         method: 'GET',
  //         mode: 'cors',
  //         cache: 'no-cache',
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       })
  //       .then(response => response.json())
  //       .then(res => res)

  //       setData(fetchData)
  //     }
  //     fetchData();
  // }, [])

  const postData = async (type) => { 
    async function fetchData() {
      const fetchData = 
        await fetch('http://localhost:8001/', {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            // data,
            url: buildUrl,
            type
          })
        })
        .then(response => response.json())
        .then(res => res)

        setData(fetchData)
      }
      fetchData();
  }

  return (
    <div className="App">
        <section className="App-header">
          <div className="dynamicUrlWrapper">
            <div className="wrapperLabel">
                <label htmlFor="googleScholarLabel">Label:</label>
                <div className="inputWrapper">
                    <input type="googleScholarLabel" value={googleScholarLabel} onChange={e => setGoogleScholarLabel(e.target.value)}/>
                    <img alt="add new field" onClick={addNewFields} src={Add} />
                </div>
            </div>
            <div className="excludedCountries">
                {googleScholarOtherParams.length > 0 && <label htmlFor="googleScholarOtherParams">Excluded countries:</label>}
                {googleScholarOtherParams.map((x, i) => {
                    return (
                        <div key={i} className="wrapperLabel">
                            <div className="inputWrapper">
                                <input key={i} type="googleScholarLabel" value={x[i]} onChange={e => setOtherParams(e.target.value, i)}/>
                                <img alt="add new field" onClick={addNewFields} src={Add} />
                                <img alt="remove this field" onClick={() => removeFields(i)} src={Minus} />
                            </div>
                        </div>
                    )
                })}
            </div>
          </div>
          <a id="goToLink" onClick={postData} href={`${buildUrl}`} rel="noopener noreferrer" target="_blank">Go to link</a>
          <div className="scrapeDiv" onClick={() => postData('POST')}>SCRAPE DATA</div>
          <div className='nextBackWrapper'>
            <div onClick={() => postData('BACK')}>BACK</div>
            <div onClick={() => postData('NEXT')}>NEXT</div>
          </div>
          {data !== undefined ? 
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.authorInfo.map((x, i) => {
                      return (
                        <tr key={i}>
                          <td><a href={x.href}>{x.text}</a></td>
                          <td>{x.email.replace("Verified email at", "")}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
          : <div>Loading...</div> 
          }
        </section>
      </div>    
    );
}

export default App;