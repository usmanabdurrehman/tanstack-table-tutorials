import { Box, Flex, Image } from "@chakra-ui/react";
import moment from "moment";
import { User } from "../../types";

interface RowDetailViewProps {
  user: User;
}

export const RowDetailView = ({ user }: RowDetailViewProps) => {
  return (
    <Flex height={150} gap={4} p={2}>
      <Box width={150}>
        <Image src={user.avatar} height="100%" width="100%" />
      </Box>
      <Flex width="50%" textAlign={"left"} alignItems="center">
        <Box>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>DOB: {moment(user.birthDate).format("MM/DD/YYYY")}</p>
        </Box>
      </Flex>
    </Flex>
  );
};
