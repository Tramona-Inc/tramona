import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";

export default function Form1() {
  return (
    <div className="h-2/5">
      <div>
        <h1 className="text-4xl font-bold">
          When we recieve offers for your property, where should we send them?
        </h1>
        <div className="space-y-3">
          <h2 className="pt-20 text-2xl font-semibold">
            We recomomend both phone number and email as the requests are first
            come first serve.
          </h2>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Enter email address" />
          </div>
          <div>
            <Label htmlFor="email">Phone Number</Label>
            <Input type="phone" placeholder="Enter phone number" />
          </div>
        </div>
      </div>
    </div>
  );
}
