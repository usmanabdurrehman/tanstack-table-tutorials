import { Box, Flex, Image } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { User } from "../../types";

export default function RowDetailView({ user }: { user: User }) {
  return (
    <Flex height={150} gap={4} p={2}>
      <Box width={150}>
        <Image src={user.avatar} height="100%" width="100%" />
      </Box>
      <Flex width="50%" textAlign={"left"} alignItems="center">
        <Box>
          <p>Name: {user.name}</p>
          <p>Age : {user.age}</p>
          <p>DOB: {moment(user.birthDate).format("DD/MM/YYYY")}</p>
        </Box>
      </Flex>
    </Flex>
  );
}
