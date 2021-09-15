import useSWR from 'swr';

let resultData: string = '';
export const useResultData = () => {
  const { data, mutate } = useSWR('resultData', () => {
    return resultData;
  });

  return {
    data,
    mutate: (value: string) => {
      resultData = value;
      return mutate();
    }
  }
}