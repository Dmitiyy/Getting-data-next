import type { NextPage } from 'next';
import { 
  Box, 
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { IDataItem } from '../types/data';

type TData = [
  data: IDataItem[], 
  getData: Function, 
  itemTitles: Array<string>,
  loading: Boolean, 
  error: Boolean,
];

const useGettingData = (): TData => {
  const [data, setData] = useState<Array<IDataItem>>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>(false);
  const [itemTitles, setItemTitles] = useState<string[]>([]);

  const getData = async () => {
    try {
      setLoading(true);
      let response: any = await fetch('https://dev-api.maxresell.ru/api/statistic/');
      response = await response.json();
      setData(response.results.report);
      setItemTitles(Object.keys(response.results.report[0]));
      setLoading(false);
      setError(false);
    } catch (err) {setError(true); setLoading(false)};
  }

  return [data, getData, itemTitles, loading, error];
};

const Home: NextPage = () => {
  const [data, getData, itemTitles, loading, error] = useGettingData();

  useEffect(() => {getData()}, []);

  const renderItem = (title: string, item: any) => {
    let text: string = item[title];
    if (title === 'editsupplierVendorCode' || title === 'cost_amount') {
      return <Input fontSize='xl' placeholder={text} />
    } else {
      if (!text) {text = 'empty'}
      return text;
    }
  }

  return (
    <Box m='0 auto' mt='10' p='10' width='6xl' mb='10' bg='#425df5' >
      <Text fontSize="2xl" fontWeight='bold' color='#fff'>
        Test task (getting data from the server)
      </Text>
      {
        error ? (
          <Text fontSize='2xl' color='#fff'>Error, try again</Text>
        ) : loading ? (
          <Text fontSize='2xl' color='#fff'>Loading...</Text>
        ) : (
          <Box overflowX='scroll'>
            <Table variant="simple" mt='10' color='#fff' fontSize='xl'>
              <Thead>
                <Tr>
                  {
                    itemTitles.map((item, i) => {
                      return (
                        <Th key={i} fontSize='sm' color='#fff'>{item}</Th>
                      )
                    })
                  }
                </Tr>
              </Thead>
              <Tbody>
                {
                  data.map((item: any) => {
                    return (
                      <Tr key={item.id}>
                        {
                          itemTitles.map((title, j) => {
                            return (
                                <Td key={item.id + j}>
                                  {renderItem(title, item)}
                                </Td>
                              )
                          })
                        }
                      </Tr>
                    )
                  })
                }
              </Tbody>
            </Table>
          </Box>
        )
      }
    </Box>
  )
}

export default Home
