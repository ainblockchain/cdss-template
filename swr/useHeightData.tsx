import useSWR from 'swr';

let heightData: number = 0;
export const useHeightData = () => {
  const { data, mutate } = useSWR('heightData', () => {
    return heightData;
  });

  return {
    data: data || 0,
    mutate: (value: number) => {
      heightData = value;
      return mutate();
    }
  }
}