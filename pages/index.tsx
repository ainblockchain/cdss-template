import axios from 'axios';
import React, { useState } from 'react';
import { ParamInput } from '../components/paramInput';
import styles from '../styles/Home.module.css'

type ParamInputProp = {
  [key: string]: {
    title?: string;
    type: 'number' | 'string';
    value?: any;
    setter?: any;
  }
}

const params: ParamInputProp = {
  'age': { title: '나이', type: 'number' },
  'height': { title: '키', type: 'number' },
};

export default function Home() {
  const [ ageState, setAgeState ] = useState<number>(0);
  const [ heightState, setHeightState ] = useState<number>(0);
  const [ resultState, setResultState ] = useState<any>({});

  params['age'] = { ...params['age'],
    value: ageState, setter: setAgeState};
  params['height'] = { ...params['height'],
    value: heightState, setter: setHeightState};

  const onClickButton = async () => {
    try {
      const res = await axios.post('/api/predict',
        { age: ageState, height: heightState });
      setResultState(res.data);
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.paramContainer}>
        { Object.keys(params).map((key) =>
          <ParamInput 
            key={key}
            title={params[key].title ? params[key].title : key}
            type={params[key].type}
            value={params[key].value}
            setter={params[key].setter}
          />
        )}
      </div>
      <button onClick={onClickButton}>입력</button>
      <div className={styles.resultContainer}>
        <div className={styles.resultTitle}>결과</div>
        { Object.keys(resultState).map((key) => 
          <div key={key}>{`${key}: ${resultState[key]}`}</div>
        )}
      </div>
    </div>
  )
}
