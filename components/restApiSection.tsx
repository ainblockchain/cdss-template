import React from 'react';
import AinJs from '@ainblockchain/ain-js';
import axios from 'axios';
import { customAlphabet } from 'nanoid'

import { useEncAgeData } from '../swr/useEncAgeData';
import { useEncHeightData } from '../swr/useEncHeightData';
import { useResultData } from '../swr/useResultData';
import styles from '../styles/Home.module.css'
import { BLOCKCHAIN_NODE } from '../common/constants';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20);

export const RestApiSection = ({
  connectManager,
}: any): React.ReactElement => {
  const ainJs = new AinJs(BLOCKCHAIN_NODE);
  const { data: encAgeData } = useEncAgeData();
  const { data: encHeightData } = useEncHeightData();
  const { data: resultData, mutate: mutateResultData } = useResultData();

  const onClickRestApiButton = async () => {
    try {
      await ainJs.he.init();
      const res = await axios.post('/api/predict',
        { age: encAgeData, height: encHeightData });
      // const result = Array.from(ainJs.he.decrypt(res.data.result))[0];
      mutateResultData(res.data.result);
    } catch (e) {
      console.log(e);
    }
  }

  const onClickBlockchainButton = async () => {
    try {
      const publicKey = await connectManager.getPublicKey();
      const taskId = nanoid();
      const payload: SendTransactionPayload = {
        ref: `/apps/he_health_care/tasks/request/0xTESTWORKER/${taskId}`,
        value: { type: 'test', user_address: publicKey },
        nonce: -1,
        parentTxHash: null
      }
      const res = await connectManager.sendTransaction(payload);
      console.log(res);
      // mutateResultData(res.data.result);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.paramContainer}>
        <div>
          { encAgeData ? 
            `Encrypted Age: ${encAgeData.substring(0, 15)}...`
            : ''
          }
        </div>
        <div>
          { encHeightData ? 
            `Encrypted Height: ${encHeightData.substring(0, 15)}...`
            : ''
          }
        </div>
      </div>
      {/*<button disabled={encAgeData === '' || encHeightData === ''}
        onClick={onClickRestApiButton}>REST API</button>*/}
      <button disabled={encAgeData === '' || encHeightData === ''}
        onClick={onClickBlockchainButton}>Blockchain</button>
      <div className={styles.paramContainer}>
        <div>
          { resultData ? 
            `Result: ${resultData.substring(0, 15)}...`
            : ''
          }
        </div>
      </div>
    </div>
  );
}

export default RestApiSection;