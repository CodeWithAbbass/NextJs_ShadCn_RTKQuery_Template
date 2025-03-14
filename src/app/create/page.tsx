"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsDemo() {
    return (
        <Tabs defaultValue="1" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="1">1</TabsTrigger>
                <TabsTrigger value="2">2</TabsTrigger>
            </TabsList>
            <TabsContent value="1">1</TabsContent>
            <TabsContent value="2">2</TabsContent>
        </Tabs>
    );
}
