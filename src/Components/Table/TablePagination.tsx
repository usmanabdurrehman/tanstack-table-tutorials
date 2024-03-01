import { Flex, IconButton, Text } from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import { User } from "../../types";

interface TablePaginationProps {
  table: Table<User>;
}

export const TablePagination = ({ table }: TablePaginationProps) => {
  const currentPageIndex = table.getState().pagination.pageIndex;

  return (
    <Flex gap={2} alignItems="center">
      <IconButton
        aria-label="First Page"
        icon={<FaAnglesLeft />}
        onClick={() => table.firstPage()}
        isDisabled={!table.getCanPreviousPage()}
        size="sm"
      />
      <IconButton
        aria-label="Prev Page"
        icon={<FaAngleLeft />}
        onClick={() => table.previousPage()}
        isDisabled={!table.getCanPreviousPage()}
        size="sm"
      />
      <IconButton
        aria-label="Next Page"
        icon={<FaAngleRight />}
        onClick={() => table.nextPage()}
        isDisabled={!table.getCanNextPage()}
        size="sm"
      />
      <IconButton
        aria-label="Last Page"
        icon={<FaAnglesRight />}
        isDisabled={!table.getCanNextPage()}
        onClick={() => table.lastPage()}
        size="sm"
      />
      <Text fontSize="s">
        Page {currentPageIndex + 1} of {table.getPageCount().toLocaleString()}
      </Text>
    </Flex>
  );
};
