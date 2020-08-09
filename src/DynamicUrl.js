import React, { useState } from 'react';
import Add from './assets/add.png';
import Minus from './assets/minus.png';

const DynamicUrl = () => {
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

    return (
        <>
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
            <a id="goToLink" href={`${buildUrl}`} rel="noopener noreferrer" target="_blank">Go to link</a>
        </>
    )
}

export { DynamicUrl };