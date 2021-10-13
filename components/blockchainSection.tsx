import React, { useState } from 'react';
import AinJs from '@ainblockchain/ain-js';
import axios from 'axios';
import { customAlphabet } from 'nanoid'

import { useEncAgeData } from '../swr/useEncAgeData';
import { useEncHeightData } from '../swr/useEncHeightData';
import { useResultData } from '../swr/useResultData';
import styles from '../styles/Home.module.css'
import { BLOCKCHAIN_NODE } from '../common/constants';

const PATH_PREFIX = '/apps/he_health_care';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20);

export const BlockchainSection = ({
  connectManager,
}: any): React.ReactElement => {
  const ainJs = new AinJs(BLOCKCHAIN_NODE);
  const { data: encAgeData } = useEncAgeData();
  const { data: encHeightData } = useEncHeightData();
  const { data: resultData, mutate: mutateResultData } = useResultData();
  const [ ageKeyState, setAgeKeyState ] = useState<string>('');
  const [ heightKeyState, setHeightKeyState ] = useState<string>('');

  const onClickBlockchainButton = async () => {
    try {
      const publicKey = await connectManager.getPublicKey();
      const taskId = nanoid();
      const payload: SendTransactionPayload = {
        ref: `${PATH_PREFIX}/tasks/request/0xTESTWORKER/${taskId}`,
        value: {
          type: 'add',
          user_address: publicKey,
          operand1: `${PATH_PREFIX}/data/${publicKey}/${ageKeyState}`,
          operand2: `${PATH_PREFIX}/data/${publicKey}/${heightKeyState}`
        },
        nonce: -1,
      }
      const res = await connectManager.sendTransaction(payload);
      console.log(res);
      // mutateResultData(res.data.result);
    } catch (e) {
      console.log(e);
    }
  }

  const onClickUploadAgeButton = async () => {
    try {
      const publicKey = await connectManager.getPublicKey();
      const ageKeyId = nanoid();
      const agePayload: SendTransactionPayload = {
        ref: `/apps/he_health_care/data/${publicKey}/${ageKeyId}`,
        value: encAgeData,
        nonce: -1,
      }
      await connectManager.sendTransaction(agePayload);
      setAgeKeyState(ageKeyId);
    } catch (e) {
      console.log(e);
    }
  }

  const onClickUploadHeightButton = async () => {
    try {
      const publicKey = await connectManager.getPublicKey();
      const heightKeyId = nanoid();
      const heightPayload: SendTransactionPayload = {
        ref: `/apps/he_health_care/data/${publicKey}/${heightKeyId}`,
        value: encHeightData,
        nonce: -1,
      }
      await connectManager.sendTransaction(heightPayload);
      setHeightKeyState(heightKeyId);
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
      <div className={styles.buttonContainer}>
        <button disabled={encAgeData === ''}
          onClick={onClickUploadAgeButton}>Upload Age</button>
        <button disabled={encHeightData === ''}
          onClick={onClickUploadHeightButton}>Upload Height</button>
      </div>
      <div className={styles.paramContainer}>
        <div>
          { ageKeyState ? `Encrypted Age ID: ${ageKeyState}` : ''}
        </div>
        <div>
          { heightKeyState ? `Encrypted Height ID: ${heightKeyState}` : ''}
        </div>
      </div>
      <button disabled={ageKeyState === '' || heightKeyState === ''}
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

export default BlockchainSection;