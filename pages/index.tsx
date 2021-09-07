import AinJs from '@ainblockchain/ain-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ParamInput } from '../components/paramInput';
import styles from '../styles/Home.module.css'
import ConnectManager from '../manager/ConnectManager';

type ParamInputProp = {
  [key: string]: {
    title?: string;
    type: 'number' | 'string';
    value?: any;
    setter?: any;
  }
}

const params: ParamInputProp = {
  'age': { title: 'Age', type: 'number' },
  'height': { title: 'Height', type: 'number' },
};

export default function Home() {
  const ainJs = new AinJs(`${process.env.BLOCKCHAIN_NODE}`);
  const [ ageState, setAgeState ] = useState<number>(0);
  const [ heightState, setHeightState ] = useState<number>(0);
  const [ resultState, setResultState ] = useState<any>({});
  const [ publicKey, setPublicKey ] = useState<string>('');
  const [ connectManager, setConnectManager ] = useState<any>(null);
  const [ encryptedState, setEncryptedState ] = useState<string>('');

  useEffect(() => {
    const connectManager = new ConnectManager();
    connectManager.initialize();
    setConnectManager(connectManager);
  }, []);


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

  const onClickBlockchainButton = async () => {
    if (!connectManager) {
      return;
    }
    connectManager.authenticate((publicKey: string) => {
      if (publicKey) {
        setPublicKey(publicKey);
      } else {
        console.error('Failed to get public key');
      }
    });
  }

  const onClickEncryptButton = async () => {
    if (!connectManager) {
      return;
    }
    // const data = [ageState, heightState];
    const data = new Array(4000).fill(ageState);
    console.log(data);
    connectManager.encrypt(data, (result: any) => {
      const { encrypted, success } = result;
      if (success) {
        console.log('success');
        setEncryptedState(encrypted);
      } else {
        console.error('Failed to get public key');
      }
    });
  }

  const onClickDecryptButton = async () => {
    console.log(encryptedState);
    if (!connectManager || encryptedState === '') {
      console.log('decrypt not ready');
      return;
    }
    // const data = [ageState, heightState];
    const data = encryptedState;
    connectManager.decrypt(data, (result: any) => {
      console.log(result);
      const { decrypted, success } = result;
      if (success) {
        console.log('success');
      } else {
        console.error('Failed to decrypt');
      }
    });
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
      <button onClick={onClickButton}>REST API</button>
      <button onClick={onClickBlockchainButton}>Blockchain</button>
      <button onClick={onClickEncryptButton}>Encrypt</button>
      <button onClick={onClickDecryptButton}>Decrypt</button>
      <div className={styles.resultContainer}>
        <div className={styles.resultTitle}>Public Key</div>
        <div>{publicKey}</div>
      </div>
      <div className={styles.resultContainer}>
        <div className={styles.resultTitle}>Result</div>
        { Object.keys(resultState).map((key) => 
          <div key={key}>{`${key}: ${resultState[key]}`}</div>
        )}
      </div>
    </div>
  )
}
