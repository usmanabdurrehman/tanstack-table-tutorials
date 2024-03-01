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
import { Box, Flex, Input } from "@chakra-ui/react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { ColumnSelector } from "./ColumnSelector";
import { TablePagination } from "./TablePagination";
import { RowDetailView } from "./RowDetailView";
import { TableHeader } from "./TableHeader";
import { fuzzyFilter, reorder } from "./Table.utils";
import { useColumns } from "./Table.columns";

export default function Table() {
  const { columnIds, columns, initialColumnVisibility, data } = useColumns();

  const table = useReactTable<User>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // Selection
    enableRowSelection: true,

    // Sub Components/Detail
    getRowCanExpand: () => true,

    // Fuzzy Search/Filter
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),

    // Pagination
    getPaginationRowModel: getPaginationRowModel(),

    // Sorting
    getSortedRowModel: getSortedRowModel(),

    initialState: {
      // Column Visibility
      columnVisibility: initialColumnVisibility,

      // Column Order
      columnOrder: columnIds,
    },
    // Controlled tutorial
    state: {},
  });

  const showTable = Object.values(table.getState().columnVisibility).filter(
    (isVisible) => isVisible
  ).length;

  return (
    <Flex height="98vh" direction={"column"} gap={2} p={2}>
      <Flex alignItems={"center"}>
        <ColumnSelector table={table} columnIds={columnIds} />
        <Input
          ml={2}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          width="300px"
          placeholder="Search..."
        />
      </Flex>

      <Box flex="1" overflow="auto">
        {!!showTable && (
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

            {false && (
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <td key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tfoot>
            )}
          </table>
        )}
      </Box>

      <Box>
        <TablePagination table={table} />
      </Box>
    </Flex>
  );
}
