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

export default function Form1() {
  return (
    <div className="">
      <h1 className="text-6xl font-bold">
        Enter the link to your listings below to get started setting up!
      </h1>
      <h2 className="pt-20 text-5xl font-semibold">
        Where do you currently list? (Please include all websites)
      </h2>

      <div className="flex flex-row">
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
    </div>
  );
}
