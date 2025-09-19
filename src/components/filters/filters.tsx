import React, { useState } from 'react';
import s from './filters.module.scss';

type Props = {}

interface IFilters {
  id: number,
  value: string,
  label: string,
  // isActive: boolean,
}

const Filters = ({ setFilter }: Props) => {

  // const [filters, setFilters] = useState()
  // all, completed, or inWork
  const filtersArray: IFilters[] = [
    {id: 1, value: 'all', label: 'Все'},
    {id: 2, value: 'inWork', label: 'в работе'},
    {id: 3, value: 'completed', label: 'сделано'},
  ];
  const filtersValues = {1: 'all', 2:'inWork', 3:'completed'}

  const handleClick = (e) => {
    const id = e.target.id;
    const filter = filtersValues[`${id}`];
    setFilter(filter);
    console.log('e.target.id: ', e.target.id);
    console.log('filter todo: ', filter);
    //jтправить запрос с фильтром
    //setTodos(filteredTodos)

    // поменять isActive
  }


  return (
    <div className={s.filters}>
      {filtersArray.map((item) => 
        <div 
          className={s.tab} 
          key={item.id}
          id={item.id}
          value={item.value}
          onClick={handleClick}
        >
          {item.label}
        </div>
        )}
    </div>
  )
}

export default Filters;