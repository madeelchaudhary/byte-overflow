import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ProfileQuestionTab from "./ProfileQuestionTab";

interface Props {
  userId: string;
  clerkId: string | null;
}

const ProfileTabs = ({ userId, clerkId }: Props) => {
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
      <TabsContent value="topPosts">
        <ProfileQuestionTab userId={userId} clerkId={clerkId} />
      </TabsContent>
      <TabsContent value="answers"></TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
