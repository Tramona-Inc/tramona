import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Form1() {
  return (
    <div className="h-2/5">
      <h1 className="text-4xl font-bold">
        Enter the link to your listings below to get started setting up!
      </h1>
      <div className="space-y-3">
        <h2 className="pt-20 text-2xl font-semibold">
          Where do you currently list? (Please include all websites)
        </h2>
        <div className="flex flex-row space-x-2">
          <div className="w-1/4">
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Where" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-3/4">
            <Input type="profile-link" placeholder="Enter your profile link" />
          </div>
        </div>
        <Textarea placeholder="Type your message here." />
      </div>
    </div>
  );
}
