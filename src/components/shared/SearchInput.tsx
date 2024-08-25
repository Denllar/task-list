import { Input } from "@/components/ui/input";


interface SearchInputProps {
  search: string;
  setSearch: (search: string) => void;
}
export const SearchInput: React.FC<SearchInputProps> = ({search, setSearch}) => {

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="dark:bg-background dark:text-foreground">
      <Input onChange={onSearch} value={search} placeholder="Search..." type="search"/>
    </div>
  );
};
