import { Box, Button, Headline, HStack, Pagination, Table } from "@kfonbss/bss-ui-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CirclePlusIcon } from "@/components/custom";
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn";
import SearchInput from "@/components/custom/SearchInput";

import { VISIBLE_COLUMNS_ROLE_LIST } from "../constants";
import CreateMenu from "../pop-up/CreateMenu";

const MenuList = () => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
  return (
    <>
    <Headline headName={t('menuList')} />

      <HStack justifyContent={'space-between'}>
        <SearchInput />
        <HStack flex={'3'} justifyContent={'end'} alignItems={'stretch'}>
          <CsvDownloadBtn minimal />
          <Button variant={'solid'} borderRadius='lg' h='10' 
          onClick={() => setOpen(true)}
          >
            <CirclePlusIcon />
            {t('newMenu')}
          </Button>
        </HStack>
      </HStack>

      <Box>
        <Table columns={VISIBLE_COLUMNS_ROLE_LIST} />
      </Box>

      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>

      <CreateMenu open={open} setOpen={setOpen} />
    </>
  )
};

export default MenuList;