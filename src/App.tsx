import React from 'react';
import { DataTable, SearchInput } from '@/components/shared'
import { useUsers } from './hooks';

function App() {
  const [search, setSearch] = React.useState("");  
  const {users, isLoading} = useUsers(search);

  return (
    <div className='w-[100%] m-auto max-w-[1200px] mt-10 dark'>
      <SearchInput search={search} setSearch={setSearch}/>
      <DataTable users={users} isLoading={isLoading} />
    </div>
  )
}

export default App
