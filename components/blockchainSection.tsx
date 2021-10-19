import React, { useEffect, useState } from 'react';
import AinJs from '@ainblockchain/ain-js';
import axios from 'axios';
import { customAlphabet } from 'nanoid'

import { useEncAgeData } from '../swr/useEncAgeData';
import { useEncHeightData } from '../swr/useEncHeightData';
import { useResultData } from '../swr/useResultData';
import styles from '../styles/Home.module.css'
import { BLOCKCHAIN_NODE } from '../common/constants';

const PATH_PREFIX = '/apps/he_health_care';
const WORKER_ID = '0xBB6b88265875c73d98dE81c2A9F3B58Ef2557b4f';
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
  const [ publicKey, setPublicKey ] = useState<string>('');
  const [ taskIdState, setTaskIdState ] = useState<string>('');
  let intervalId: NodeJS.Timeout;

  useEffect(() => {
    console.log(BLOCKCHAIN_NODE);
    async function fetchPublicKey() {
      if (connectManager) {
        const publicKey = await connectManager.getPublicKey();
        setPublicKey(publicKey);
      }
    }
    fetchPublicKey();
  })

  const onClickBlockchainButton = async () => {
    try {
      const taskId = nanoid();
      const payload: SendTransactionPayload = {
        ref: `${PATH_PREFIX}/tasks/request/${WORKER_ID}/${taskId}`,
        value: {
          type: 'add',
          user_address: publicKey,
          operand1: `${PATH_PREFIX}/data/${publicKey}/${ageKeyState}`,
          operand2: `${PATH_PREFIX}/data/${publicKey}/${heightKeyState}`
        },
        nonce: -1,
      }
      const res = await connectManager.sendTransaction(payload);
      if (res.result.code === 0 /* success */) {
        setTaskIdState(taskId);
        intervalId = setInterval(async () => {
          const responseRef = `${PATH_PREFIX}/tasks/response/${publicKey}/${taskId}`;
          const result = await axios.get(
            `${BLOCKCHAIN_NODE}/get_value?ref=${responseRef}`
          );
          if (result.data.result) {
            clearInterval(intervalId);
            mutateResultData(result.data.result.result);
          }
        }, 1000)
      } else{
        console.log(res.result.error_message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const onClickUploadAgeButton = async () => {
    try {
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
        {ageKeyState &&
          <div>
            Encrypted Age ID:
            <a target='_blank' rel='noreferrer'
                href={`${BLOCKCHAIN_NODE}/get_value?ref=${PATH_PREFIX}/data/${publicKey}/${ageKeyState}`}>
              {ageKeyState}
            </a>
          </div>}
        {heightKeyState !== '' && 
          <div>
            Encrypted Height ID:
            <a target='_blank' rel='noreferrer'
                href={`${BLOCKCHAIN_NODE}/get_value?ref=${PATH_PREFIX}/data/${publicKey}/${heightKeyState}`}>
              {heightKeyState}
            </a>
          </div>
        }
      </div>
      <button disabled={ageKeyState === '' || heightKeyState === ''}
        onClick={onClickBlockchainButton}>Blockchain</button>
      <div className={styles.paramContainer}>
        {taskIdState !== '' &&
          <div>
            Task ID:
            <a target='_blank' rel='noreferrer'
                href={`${BLOCKCHAIN_NODE}/get_value?ref=${PATH_PREFIX}/tasks/request/${WORKER_ID}/${taskIdState}`}>
              {taskIdState}
            </a>
          </div>}
        {resultData &&
          <div>
            Result:
            <a target='_blank' rel='noreferrer'
                href={`${BLOCKCHAIN_NODE}/get_value?ref=${PATH_PREFIX}/tasks/response/${publicKey}/${taskIdState}`}>
              {`${resultData.substring(0, 15)}`}
            </a>
          </div>}
      </div>
    </div>
  );
}

export default BlockchainSection;
