"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
} from "./popover";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const safeSelected = React.useMemo(() => Array.isArray(selected) ? selected : [], [selected]);

  const handleUnselect = (itemValue: string) => {
    onChange(safeSelected.filter((i) => i !== itemValue));
  };

  const handleSelect = (itemValue: string) => {
    const isSelected = safeSelected.includes(itemValue);
    if (isSelected) {
      onChange(safeSelected.filter((i) => i !== itemValue));
    } else {
      onChange([...safeSelected, itemValue]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between rounded-xl h-auto min-h-[44px] py-2 text-left"
          >
            <div className="flex flex-wrap gap-1">
              {safeSelected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {safeSelected.map((itemValue) => {
                const option = options.find((o) => o.value === itemValue);
                return (
                  <Badge
                    key={itemValue}
                    variant="secondary"
                    className="rounded-lg px-2 py-0.5 text-xs font-medium flex items-center gap-1"
                  >
                    {option?.label || itemValue}
                    <div
                      role="button"
                      tabIndex={0}
                      className="ml-1 rounded-full outline-none hover:bg-muted-foreground/20 p-0.5 transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleUnselect(itemValue);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(itemValue);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </div>
                  </Badge>
                );
              })}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0 rounded-xl shadow-2xl border-border" 
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Command className="rounded-xl">
            <CommandInput placeholder="Search..." className="h-11" />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-colors",
                        safeSelected.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {safeSelected.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span className="flex-1">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
