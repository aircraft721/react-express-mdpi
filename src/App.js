import React, { useState, useEffect } from 'react';
import './App.css';
import { DynamicUrl } from './DynamicUrl';

function App() {
  const [data, setData] = useState()

  useEffect(() => {
    async function fetchData() {
      const fetchData = 
        await fetch('http://localhost:8001/', {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(res => res)

        setData(fetchData)
      }
      fetchData();
  }, [])

  return (
    <div className="App">
        <section className="App-header">
          <DynamicUrl />
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