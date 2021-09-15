import useSWR from 'swr';

let encHeightData: string = '';
export const useEncHeightData = () => {
  const { data, mutate } = useSWR('encHeightData', () => {
    return encHeightData;
  });

  return {
    data,
    mutate: (value: string) => {
      encHeightData = value;
      return mutate();
    }
  }
}