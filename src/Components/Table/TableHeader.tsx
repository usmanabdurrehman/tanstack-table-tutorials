import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { flexRender, Header } from "@tanstack/react-table";
import { Draggable } from "react-beautiful-dnd";
import { FaEllipsisVertical } from "react-icons/fa6";
import { User } from "../../types";

interface TableHeaderProps {
  header: Header<User, unknown>;
  index: number;
}

export const TableHeader = ({ header, index }: TableHeaderProps) => {
  return (
    <Draggable
      draggableId={header.id}
      key={header.id}
      index={index}
      isDragDisabled={!!header.column.getIsPinned()}
    >
      {/*@ts-ignore */}
      {(provided, snapshot) => (
        <th
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          key={header.id}
          colSpan={header.colSpan}
          style={{
            width: header.getSize(),
            position: "relative",
            ...provided.draggableProps.style,
            ...(snapshot.isDragging && {
              background: "gray",
            }),
            ...(header.column.getIsPinned() && {
              background: "rgb(97 6 79)",
            }),
          }}
        >
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FaEllipsisVertical />}
              style={{
                position: "absolute",
                right: 4,
                top: 10,
                color: "black",
              }}
              className="menu"
              size="xs"
              colorScheme={"whiteAlpha"}
            />
            <Portal>
              <MenuList color="black">
                {header.column.getIsPinned() !== "right" && (
                  <MenuItem onClick={() => header.column.pin("right")}>
                    Pin to Right
                  </MenuItem>
                )}
                {header.column.getIsPinned() !== "left" && (
                  <MenuItem onClick={() => header.column.pin("left")}>
                    Pin to Left
                  </MenuItem>
                )}
                {header.column.getIsPinned() && (
                  <MenuItem onClick={() => header.column.pin(false)}>
                    Unpin
                  </MenuItem>
                )}

                <MenuItem onClick={header.column.getToggleSortingHandler()}>
                  {header.column.getIsSorted() === "desc"
                    ? "Sort Asc"
                    : "Sort Desc"}
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </th>
      )}
    </Draggable>
  );
};
