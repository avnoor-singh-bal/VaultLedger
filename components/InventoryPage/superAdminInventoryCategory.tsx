"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Admin } from "@/models/models";

interface Props {
  onChange: (value: string) => void;
}

const SuperAdminInventoryCategoryCombo: React.FC<Props> = ({onChange}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("Sample");
  const [categories, setCategories] = React.useState<string[]>([]);
  // Get Categories
  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch("/api/admin");
        const data = await res.json();
        const AdminsData = data.admins;
        setCategories(["Sample", ...AdminsData.map((admin: Admin) => admin.category)]);
      } catch (error) {
        alert(error);
      }
    };
    getCategories();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((category) => category === value)
            : "Select Category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Cateogory..." />
          <CommandList>
            <CommandEmpty>No Category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SuperAdminInventoryCategoryCombo;