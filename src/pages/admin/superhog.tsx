"use client";

import CreateSuperhog from "@/components/admin/superhog/CreateSuperhog";
import EditSuperhogForm from "@/components/admin/superhog/EditSuperhogForm";
import Dashboard from "../feed";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Head from "next/head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteSuperhog from "@/components/admin/superhog/DeleteSuperhog";
//create function

export default function Page() {
  return (
    <DashboardLayout type="admin">
      <Head>
        <title>Superhog verification form | Tramona</title>
      </Head>
      <div className="flex w-full items-center justify-center">
        <Tabs defaultValue="Create Verification" className=" w-[800px]">
          <TabsList className="">
            <TabsTrigger value="Create Verification">
              Create Verification
            </TabsTrigger>
            <TabsTrigger value="Edit Verification">
              Edit Existing Verifications
            </TabsTrigger>
            <TabsTrigger value="Delete Verification">
              Delete Existing Verifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Create Verification">
            <CreateSuperhog />
          </TabsContent>
          <TabsContent value="Edit Verification">
            <EditSuperhogForm />
          </TabsContent>
          <TabsContent value="Delete Verification">
            <DeleteSuperhog />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
