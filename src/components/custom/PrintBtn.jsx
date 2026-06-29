import { Button } from '@kfonbss/bss-ui-components';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { PrintIcon } from '@/components/custom';

import PrintTable from './PrintTable';

const PrintBtn = ({ title, columns, data, label, ...props }) => {
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: title || 'Print'
    });

    return (
        <>
            <Button variant="outline" borderRadius="md" height="40px" onClick={handlePrint} {...props}>
                <PrintIcon />
                {label || 'Print'}
            </Button>
            <div style={{ display: 'none' }}>
                <PrintTable ref={componentRef} title={title} columns={columns} data={data} />
            </div>
        </>
    );
};

export default PrintBtn;
