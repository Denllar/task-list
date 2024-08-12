import React from "react";
import { Input } from "@/components/ui/input";

export const SearchInput: React.FC = () => {
  const [search, setSearch] = React.useState("");

  console.log(search);
  

  return (
    <div className="dark:bg-background dark:text-foreground">
      <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search" type="search"/>
    </div>
  );
};
