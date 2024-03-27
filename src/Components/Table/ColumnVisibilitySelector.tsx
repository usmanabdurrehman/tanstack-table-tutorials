import {
  Checkbox,
  CheckboxGroup,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { FaDiceFour } from "react-icons/fa6";
import { User } from "../../types";
import { Table } from "@tanstack/react-table";
import { convertCamelToTitleCase } from "./Table.utils";

interface ColumnSelector {
  table: Table<User>;
  columnIds: string[];
}

export const ColumnVisibilitySelector = ({
  table,
  columnIds,
}: ColumnSelector) => {
  const columnVisibilityCheckboxState = Object.entries(
    table.getState().columnVisibility
  )
    .filter(([_, value]) => value)
    .map(([key]) => key);

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="Show Column Visibility"
          icon={<FaDiceFour />}
          size="sm"
          m={2}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <RadioGroup
            onChange={(value) => {
              table.setColumnVisibility(
                columnIds.reduce((acc: { [id: string]: boolean }, val) => {
                  acc[val] = value === "all";
                  return acc;
                }, {})
              );
            }}
            mb={2}
            defaultValue="all"
          >
            <Stack direction="row">
              <Radio value="all">Show All</Radio>
              <Radio value="none">Show None</Radio>
            </Stack>
          </RadioGroup>

          <CheckboxGroup
            value={columnVisibilityCheckboxState}
            colorScheme="green"
            onChange={(selectedOptions) =>
              table.setColumnVisibility(
                columnIds.reduce((acc: { [id: string]: boolean }, val) => {
                  acc[val] = selectedOptions.includes(val);
                  return acc;
                }, {})
              )
            }
          >
            <Stack>
              {columnIds.map((id) => (
                <Checkbox value={id}>{convertCamelToTitleCase(id)}</Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
