import useSWR from 'swr';

let ageData: number = 0;
export const useAgeData = () => {
  const { data, mutate } = useSWR('ageData', () => {
    return ageData;
  });

  return {
    data: data || 0,
    mutate: (value: number) => {
      ageData = value;
      return mutate();
    }
  }
}