import { Button, Flex, Link, Text } from '@kfonbss/bss-ui-components';

export const STATE_REDUCER_KEY = 'lnp-retail-subscribers';

export const SUBSCRIBER_FILTER_OPTIONS = [
  { id: 'view_all', name: 'View All' },
  { id: 'username', name: 'Username' },
  { id: 'package', name: 'Package' },
  { id: 'fallback_status', name: 'Fall Back Status' },
  { id: 'renewal_date', name: 'Renewal Date' },
  { id: 'balance', name: 'Balance' },
  { id: 'mobile_no', name: 'Mobile No.' },
  { id: 'email', name: 'Email' },
  { id: 'updated_date', name: 'Updated Date' },
  { id: 'gstin', name: 'GSTIN' },
  { id: 'ont_mapped', name: 'ONT Mapped' }
];

export const SUBSCRIBER_PERSONAL_DETAILS = [
  {
    label: 'applicantName',
    data: 'Sriharsha Mishra'
  },
  {
    label: 'mobileNumber',
    data: '9904654199'
  },
  {
    label: 'emailAddress',
    data: 'sriharshamishra.eee@gmail.com'
  },
  {
    label: 'permAddress',
    data: 'DNO65 NILADRIBIHAR Bhanjanagar, Kollam ,Kerala 691010'
  },
  {
    label: 'permAddress',
    data: 'DNO65 NILADRIBIHAR Bhanjanagar, Kollam ,Kerala 691010'
  }
];

export const getSubscriptionGridData = ({
  setChangePackage,
  setTopUpPackage,
  setOTTRecharge,
  setIsMapping,
  setIsOpen
}) => {
  return [
    {
      key: 'Username',
      value: (
        <Text fontWeight='semibold' color='#8D0247'>
          kfon.sriharsha
        </Text>
      )
    },
    {
      key: 'Subscriber ID',
      value: (
        <Text fontWeight='semibold' color='#8D0247'>
          870
        </Text>
      )
    },
    {
      key: 'Subscription Expiry',
      value: (
        <Text fontWeight='semibold' color='#8D0247'>
          2025-11-18
        </Text>
      )
    },
    {
      key: 'OTT Expiry',
      value: (
        <Flex gap={6} alignItems='center'>
          <Text fontWeight='semibold' color='#8D0247'>
            2025-11-18
          </Text>

          <Button
            variant='outline'
            onClick={() => {
              setTopUpPackage(false);
              setChangePackage(false);
              setOTTRecharge(true);
              setIsOpen(true);
            }}
            display='flex'
            alignItems='center'
            justifyContent='center'
            height='32px' // optional for equal height
            px='16px'
          >
            Active
          </Button>
        </Flex>
      )
    },
    { key: 'Subscription Type', value: 'Home Connection' },
    {
      key: 'Package',
      value: (
        <Flex gap={6} alignItems='center'>
          <Text fontWeight='semibold'>KFON-OTT BF-Amaze-QY-4500 GB-65 Mbps</Text>
          <Button
            variant='outline'
            onClick={() => {
              setTopUpPackage(false);
              setChangePackage(true);
              setIsOpen(true);
            }}
            display='flex'
            alignItems='center'
            justifyContent='center'
            height='32px' // optional for equal height
            px='16px'
          >
            Change Package
          </Button>
        </Flex>
      )
    },
    { key: 'Created on', value: '2025-04-10' },
    { key: 'Last Top up', value: '3,023.34 on 2025-08-27 11:14:31' },
    {
      key: 'Account Balance',
      value: (
        <Flex gap={6} alignItems='center'>
          <Text fontWeight='semibold'>3,023.34</Text>
          <Text fontWeight='semibold' color='#8D0247'>
            You have a enough balance to renew with current package!
          </Text>
          <Button
            variant='outline'
            onClick={() => {
              setChangePackage(false);
              setTopUpPackage(true);
              setIsOpen(true);
            }}
            display='flex'
            alignItems='center'
            justifyContent='center'
            height='32px' // optional for equal height
            px='16px'
          >
            Top-up Subscriber Account
          </Button>
        </Flex>
      )
    },
    { key: 'View Data Usage', value: '4-FUP19Mbps-1Mbps-1GB-FTTH' },
    {
      key: 'View Data Usage',
      value: <Link variant={'outline'}>Click Here</Link>
    },
    {
      key: 'Add PON Port Device',
      value: (
        <Button
          variant={'outline'}
          onClick={() => {
            setIsMapping(true);
            setIsOpen(true);
          }}
        >
          Add PON Port Details
        </Button>
      )
    }
  ];
};

export const ONT_GRID_DATA = [
  { key: 'Device Provider', value: 'KFON' },
  { key: 'Device Type', value: 'ONT' },
  { key: 'Device Make', value: 'Netlink ICT Private Limited' },
  { key: 'Device Category', value: 'Type-2 Dual Band' },
  { key: 'Device Model', value: 'HG323DAC' },
  { key: 'GPON Serial Number', value: '04123kp0429' },
  { key: 'MAC Address', value: '01:vero:55:r:aw:20' }
];

export const TOP_UP_DATA = [
  { key: 'Device Provider', value: 'KFON' },
  { key: 'Device Type', value: 'ONT' }
];
