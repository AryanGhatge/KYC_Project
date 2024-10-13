// import { getServerSession } from "next-auth";
import FormSteps from "@/components/FormSteps";
import React from "react";

const page = async () => {
  // const session = await getServerSession(NEXT_AUTH);

  return (
    <div>
      <FormSteps />
      {/* {JSON.stringify(session)} */}
    </div>
  );
};

export default page;
