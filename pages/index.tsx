import AinJs from '@ainblockchain/ain-js';
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
  const ainJs = new AinJs(`${process.env.BLOCKCHAIN_NODE}`);
  const [ ageState, setAgeState ] = useState<number>(0);
  const [ heightState, setHeightState ] = useState<number>(0);
  const [ resultState, setResultState ] = useState<any>({});

  params['age'] = { ...params['age'],
    value: ageState, setter: setAgeState};
  params['height'] = { ...params['height'],
    value: heightState, setter: setHeightState};

  const encryptData = async (data: any) => {
    const encrypted = ainJs.he.encrypt(Float64Array.from([data]));
    return encrypted.save();
  }

  const onClickButton = async () => {
    try {
      await ainJs.he.init();
      const eAge = await encryptData(ageState);
      const eHeight = await encryptData(heightState);

      /*
      const loadedAge = ainJs.he.seal.seal.CipherText();
      loadedAge.load(ainJs.he.seal.context, eAge);
      const loadedHeight = ainJs.he.seal.seal.CipherText();
      loadedHeight.load(ainJs.he.seal.context, eHeight);
      ainJs.he.seal.evaluator.add(loadedAge, loadedHeight, loadedAge);
      const result_local = ainJs.he.decrypt(loadedAge.save());
      console.log(loadedAge.save());
      console.log(result_local);
      */

      const res = await axios.post('/api/predict',
        { age: eAge, height: eHeight });
      const result = Array.from(ainJs.he.decrypt(res.data.result))[0];
      setResultState({result});
    } catch (e) {
      console.log(e);
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
