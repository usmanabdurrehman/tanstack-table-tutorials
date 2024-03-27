import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import "./index.css";
import { User } from "../../types";
import { Box, Code, Flex, Input } from "@chakra-ui/react";

import { useTableData } from "./useTableData";
import { TableHeader } from "./TableHeader";
import { fuzzyFilter, reorder } from "./Table.utils";
import Pagination from "./Pagination";
import RowDetailView from "./RowDetailView";
import { ColumnVisibilitySelector } from "./ColumnVisibilitySelector";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function Table() {
  const { columns, data, initialColumnVisibility, columnIds } = useTableData();

  const table = useReactTable<User>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,

    getPaginationRowModel: getPaginationRowModel(),

    enableRowSelection: true,
    getRowCanExpand: () => true,

    initialState: {
      columnVisibility: initialColumnVisibility,
      columnOrder: columnIds,
    },
  });

  return (
    <Flex width="100vw">
      <Flex height="98vh" direction={"column"} gap={2} p={2} grow="1">
        <Flex alignItems={"center"}>
          <ColumnVisibilitySelector table={table} columnIds={columnIds} />
          <Input
            ml={2}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            width="300px"
            placeholder="Search..."
          />
        </Flex>

        <Box flex="1" overflow="auto">
          <table style={{ overflow: "auto" }}>
            <DragDropContext
              onDragEnd={({ destination, source }) => {
                if (!destination) {
                  return;
                }

                const items = reorder(
                  table.getState().columnOrder,
                  source.index,
                  destination.index
                );

                table.setColumnOrder(items);
              }}
            >
              <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <Droppable
                    droppableId="header"
                    direction="horizontal"
                    type="column"
                  >
                    {/*@ts-ignore */}
                    {(provided) => (
                      <tr
                        key={headerGroup.id}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {headerGroup.headers.map((header, index) => (
                          <TableHeader header={header} index={index} />
                        ))}
                        {provided.placeholder}
                      </tr>
                    )}
                  </Droppable>
                ))}
              </thead>
            </DragDropContext>

            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <>
                    <tr
                      key={row.id}
                      style={{
                        // Selection
                        background: row.getIsSelected() ? "#161654" : "white",
                        color: row.getIsSelected() ? "white" : "black",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>
                          <RowDetailView user={row.original} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>

            <tfoot>
              {table.getFooterGroups().map((footerGroup) => {
                return (
                  <tr>
                    {footerGroup.headers.map((footer) => {
                      return (
                        <td>
                          {footer.isPlaceholder
                            ? null
                            : flexRender(
                                footer.column.columnDef.footer,
                                footer.getContext()
                              )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tfoot>
          </table>
        </Box>
        <Box>
          <Pagination table={table} />
        </Box>
      </Flex>
    </Flex>
  );
}
