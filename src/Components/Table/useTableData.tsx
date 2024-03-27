import { Checkbox, Flex, IconButton, Image } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { useMemo, useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { USERS } from "../../data";
import { User } from "../../types";

const DISPLAY_COLUMN_SIZE = 100;

const columnHelper = createColumnHelper<User>();

export const useTableData = () => {
  const [data, setData] = useState(USERS);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "selection",
        header: ({ table }) => (
          <Flex justifyContent={"center"} alignItems="center">
            <Checkbox
              isChecked={table.getIsAllRowsSelected()}
              isIndeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </Flex>
        ),
        cell: ({ row }) => (
          <Flex justifyContent={"center"} alignItems="center">
            <Checkbox
              onChange={row.getToggleSelectedHandler()}
              isChecked={row.getIsSelected()}
            />
          </Flex>
        ),
        size: DISPLAY_COLUMN_SIZE,
      }),
      columnHelper.display({
        id: "expand",
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <Flex justifyContent={"center"} alignItems="center">
              <IconButton
                aria-label="Expand row"
                icon={row.getIsExpanded() ? <FaMinus /> : <FaPlus />}
                size="xs"
                onClick={row.getToggleExpandedHandler()}
              />
            </Flex>
          ) : null,
        size: DISPLAY_COLUMN_SIZE,
      }),
      columnHelper.accessor("id", {
        id: "id",
        header: "Id",
        size: DISPLAY_COLUMN_SIZE,
      }),
      columnHelper.accessor("avatar", {
        id: "avatar",
        header: "Avatar",
        cell: ({ getValue }) => (
          <Flex alignItems={"center"} justifyContent="center">
            <Image
              src={getValue()}
              width="30px"
              height="30px"
              borderRadius={"50%"}
            />
          </Flex>
        ),
        size: 140,
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: "Name",
      }),

      columnHelper.accessor("birthDate", {
        id: "birthDate",
        header: "Birth Date",
        cell: ({ getValue }) => moment(getValue()).format("DD/MM/YYYY"),
      }),
      columnHelper.accessor("age", {
        id: "age",
        header: "Age",
        size: DISPLAY_COLUMN_SIZE,
        footer: ({ table }) =>
          table.getFilteredRowModel().rows.reduce((acc, val) => {
            acc += Number(val.getValue("age"));
            return acc;
          }, 0),
      }),
      columnHelper.display({
        id: "delete",
        header: () => (
          <Flex justifyContent={"center"} alignItems="center">
            <FaTrash />
          </Flex>
        ),
        cell: ({ row }) => (
          <Flex justifyContent={"center"} alignItems="center">
            <IconButton
              aria-label="Delete row"
              icon={<FaTrash />}
              colorScheme="red"
              onClick={() =>
                setData((prevData) =>
                  prevData.filter((user) => user.id !== row.original.id)
                )
              }
              size="xs"
            />
          </Flex>
        ),
        size: DISPLAY_COLUMN_SIZE,
      }),
    ],
    []
  );

  const columnIds = useMemo(
    () => columns.map((column) => column.id) as string[],
    []
  );

  const initialColumnVisibility = useMemo(() => {
    return columnIds.reduce((acc: { [id: string]: boolean }, val) => {
      acc[val] = true;
      return acc;
    }, {});
  }, []);

  return { columns, data, initialColumnVisibility, columnIds };
};
