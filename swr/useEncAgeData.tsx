import useSWR from 'swr';

let encAgeData: string = '';
export const useEncAgeData = () => {
  const { data, mutate } = useSWR('encAgeData', () => {
    return encAgeData;
  });

  return {
    data,
    mutate: (value: string) => {
      encAgeData = value;
      return mutate();
    }
  }
}