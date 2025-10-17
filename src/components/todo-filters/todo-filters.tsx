import { useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';
import type { TodoInfo, Filter } from '../../types/types';
import s from './todo-filters.module.scss'



interface FiltersProps {
  setListFilter: Dispatch<SetStateAction<Filter>>,
  listsInfo: TodoInfo | null,
}

interface FiltersValueLabel {
  value: Filter,
  label: string,
}

const TodoFilters = ({ setListFilter, listsInfo }: FiltersProps) => {
  const [currentValue, setCurrentValue] = useState<Filter>('all');


  const filtersArray: FiltersValueLabel[] = [
    {value: 'all', label: 'Все'},
    {value: 'inWork', label: 'В прогрессе'},
    {value: 'completed', label: 'Завершенные'},
  ];

  const handleClick = (filterValue: Filter) => {
    setListFilter(filterValue);
    setCurrentValue(filterValue);
  }


  return (
    <div className={s.filters}>
      {filtersArray.map((item: FiltersValueLabel) => 
        <div 
          className={`${s.tab} ${currentValue === item.value ? s.isActive : ''}`} 
          key={item.value}
          onClick={() => handleClick(item.value)}
        >
          {item.label} ({listsInfo?.[`${item.value}`]})
          {/* количество задач не меняется в завершенных и в работе, если сделать toggle/delete/add */}
        </div>
        )}
    </div>
  )
}

export default TodoFilters;