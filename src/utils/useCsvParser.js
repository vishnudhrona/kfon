import { useCallback, useState } from 'react';

const useCsvParser = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setData([]);
    setColumns([]);
    setFileName('');
    setError(null);
    setIsLoading(false);
  }, []);

  const parseFile = useCallback(
    (file) => {
      reset();
      setFileName(file?.name || '');

      if (!file) {
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const rows = text.split('\n').filter((row) => row.trim() !== '');

          const unquote = (val) => {
            let s = val.trim();
            if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
              return s.slice(1, -1).replace(/""/g, '"');
            }
            return s;
          };

          if (rows.length > 0) {
            const headers = rows[0].split(',').map(unquote);
            const newColumns = headers.map((header) => ({
              accessor: header,
              header: header
            }));
            setColumns(newColumns);

            const newData = rows.slice(1).map((row, index) => {
              const values = row.split(',').map(unquote);
              const rowData = {};
              headers.forEach((header, i) => {
                rowData[header] = values[i];
              });
              return { id: index, ...rowData };
            });
            setData(newData);
          } else {
            setData([]);
            setColumns([]);
          }
        } catch (err) {
          setError('Failed to parse CSV file');
          console.error('CSV parse error:', err);
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setIsLoading(false);
      };

      reader.readAsText(file);
    },
    [reset]
  );

  return {
    data,
    columns,
    fileName,
    isLoading,
    error,
    parseFile,
    reset
  };
};

export default useCsvParser;
