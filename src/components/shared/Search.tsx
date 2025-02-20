import { Input } from '@/components/ui/input'
import React from 'react'

interface SearchProps {
  searchValue: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export const Search: React.FC<SearchProps> = ({searchValue, setSearchValue}) => {;
  return (
    <div className='w-[100%]'>
      <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type='search' placeholder='Поиск задач...'/>
    </div>
  )
}



