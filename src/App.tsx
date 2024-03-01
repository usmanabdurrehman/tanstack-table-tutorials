import { ChakraProvider } from "@chakra-ui/react";
import { Table } from "./Components/Table";

export default function App() {
  return (
    <ChakraProvider>
      <Table />
    </ChakraProvider>
  );
}
