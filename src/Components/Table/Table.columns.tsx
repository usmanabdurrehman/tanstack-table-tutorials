import { Checkbox, Flex, IconButton, Image } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { useMemo, useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { USERS } from "../../data";
import { User } from "../../types";

const columnHelper = createColumnHelper<User>();

const DISPLAY_COLUMN_SIZE = 100;

export const useColumns = () => {
  const [data, setData] = useState(USERS);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "selection",
        header: ({ table }) => {
          return (
            <Checkbox
              isChecked={table.getIsAllRowsSelected()}
              isIndeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          );
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              isChecked={row.getIsSelected()}
              isIndeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          );
        },
        size: DISPLAY_COLUMN_SIZE,
      }),
      columnHelper.display({
        id: "expander",
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <IconButton
              aria-label="Expand Row"
              icon={row.getIsExpanded() ? <FaMinus /> : <FaPlus />}
              onClick={row.getToggleExpandedHandler()}
              size="xs"
            />
          ) : null;
        },
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
        cell: (info) => (
          <Flex alignItems={"center"} justifyContent="center">
            <Image
              src={info.getValue()}
              height={"30px"}
              width="30px"
              borderRadius="50%"
            />
          </Flex>
        ),
        size: 120,
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: "Name",
      }),
      columnHelper.accessor("birthDate", {
        id: "birthDate",
        header: "Birth date",
        cell: (info) => moment(info.getValue()).format("MM/DD/YYYY"),
      }),
      columnHelper.display({
        id: "delete",
        header: () => (
          <Flex justifyContent={"center"}>
            <FaTrash />
          </Flex>
        ),
        cell: ({ row }) => {
          return (
            <IconButton
              aria-label="Delete User"
              icon={<FaTrash />}
              onClick={() =>
                setData((prevData) =>
                  prevData.filter((user) => user.id !== row.original.id)
                )
              }
              size="xs"
              colorScheme="red"
            />
          );
        },
        size: DISPLAY_COLUMN_SIZE,
      }),
    ],
    []
  );

  const columnIds = useMemo(
    () => columns.map((column) => column.id) as string[],
    [columns]
  );

  const initialColumnVisibility = useMemo(
    () =>
      columnIds.reduce((acc: { [id: string]: boolean }, val) => {
        acc[val] = true;
        return acc;
      }, {}),
    [columnIds]
  );

  return { columnIds, columns, initialColumnVisibility, data };
};
