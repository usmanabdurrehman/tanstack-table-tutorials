import { Flex, IconButton, Text } from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import React from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import { User } from "../../types";

export default function Pagination({ table }: { table: Table<User> }) {
  return (
    <Flex gap={2} alignItems="center">
      <IconButton
        aria-label="First Page"
        icon={<FaAnglesLeft />}
        size="sm"
        onClick={() => table.firstPage()}
        isDisabled={!table.getCanPreviousPage()}
      />
      <IconButton
        aria-label="Prev Page"
        icon={<FaAngleLeft />}
        size="sm"
        onClick={() => table.previousPage()}
        isDisabled={!table.getCanPreviousPage()}
      />
      <IconButton
        aria-label="Next Page"
        icon={<FaAngleRight />}
        size="sm"
        onClick={() => table.nextPage()}
        isDisabled={!table.getCanNextPage()}
      />
      <IconButton
        aria-label="Last Page"
        icon={<FaAnglesRight />}
        size="sm"
        onClick={() => table.lastPage()}
        isDisabled={!table.getCanNextPage()}
      />
      <Text fontSize="s">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </Text>
    </Flex>
  );
}
