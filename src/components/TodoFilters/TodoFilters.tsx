import { useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';
import type { TodoInfo, Filter } from '../../types/types';
import s from './TodoFilters.module.scss'



interface FiltersProps {
  setListFilter: Dispatch<SetStateAction<Filter>>,
  todoInfo: TodoInfo | null,
}

interface FilterStatusLabel { //FiltersValueLabel //TodoStatusLabel //FilterStatusLabel
  value: Filter,
  label: string,
}

const TodoFilters = ({ setListFilter, todoInfo }: FiltersProps) => {
  const [currentValue, setCurrentValue] = useState<Filter>('all');

  const filterStatuses: FilterStatusLabel[] = [ //statusFilters: TodoStatusLabel //filtersArray: FiltersValueLabel[]
    {value: 'all', label: 'Все'},
    {value: 'inWork', label: 'В прогрессе'},
    {value: 'completed', label: 'Завершенные'},
  ];

  const handleFilterSelect = (filterValue: Filter) => { //handleClick
    setListFilter(filterValue);
    setCurrentValue(filterValue);
  }


  return (
    <nav className={s.filters}>
      {filterStatuses.map((filterStatus: FilterStatusLabel) => //valueLabel //todoStatus
        <div 
          className={`${s.tab} ${currentValue === filterStatus.value ? s.isActive : ''}`} 
          key={filterStatus.value}
          onClick={() => handleFilterSelect(filterStatus.value)}
        >
          {filterStatus.label} ({todoInfo?.[`${filterStatus.value}`]})
        </div>
        )}
    </nav>
  )
}

export default TodoFilters;