import React from 'react';

const PrintTable = React.forwardRef(({ title, columns, data }, ref) => {
    return (
        <div ref={ref} style={{
            padding: '20px',
            boxSizing: 'border-box',
            margin: '0 auto',
            maxWidth: '100%'
        }}>
            <style>
                {`
                    @media print {
                        @page {
                            margin: 20px;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                `}
            </style>
            {title && (
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontSize: '20px',
                    fontWeight: 'bold'
                }}>
                    {title}
                </h2>
            )}
            <div style={{
                overflow: 'visible',
                border: '1px solid #ddd',
                boxSizing: 'border-box'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    tableLayout: 'fixed'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            {columns.map((col, index) => (
                                <th key={index} style={{
                                    borderRight: index < columns.length - 1 ? '1px solid #ddd' : 'none',
                                    borderBottom: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'left',
                                    boxSizing: 'border-box'
                                }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} style={{
                                        borderRight: colIndex < columns.length - 1 ? '1px solid #ddd' : 'none',
                                        borderBottom: rowIndex < data.length - 1 ? '1px solid #ddd' : 'none',
                                        padding: '8px',
                                        textAlign: 'left',
                                        boxSizing: 'border-box'
                                    }}>
                                        {row[col.accessor] || ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

PrintTable.displayName = 'PrintTable';

export default PrintTable;