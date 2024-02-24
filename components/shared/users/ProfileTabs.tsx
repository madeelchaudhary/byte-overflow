import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ProfileQuestionTab from "./ProfileQuestionTab";
import ProfileAnswerTab from "./ProfileAnswerTab";

interface Props {
  userId: string;
  clerkId: string | null;
  searchParams: {
    [key: string]: any;
  };
}

const ProfileTabs = ({ userId, clerkId, searchParams }: Props) => {
  return (
    <Tabs defaultValue="topPosts" className="flex-1">
      <TabsList className="background-light800_dark400 min-h-[42px] p-1">
        <TabsTrigger value="topPosts" className="tab">
          Top Posts
        </TabsTrigger>
        <TabsTrigger value="answers" className="tab">
          Answers
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="topPosts"
        className="flex w-full flex-col gap-6 data-[state=active]:mt-5"
      >
        <ProfileQuestionTab
          userId={userId}
          clerkId={clerkId}
          searchParams={searchParams}
        />
      </TabsContent>
      <TabsContent
        value="answers"
        className="flex w-full flex-col gap-6 data-[state=active]:mt-5"
      >
        <ProfileAnswerTab
          userId={userId}
          clerkId={clerkId}
          searchParams={searchParams}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
