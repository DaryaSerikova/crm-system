import { useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';
import type { TodoInfo, Filter } from '../../types/types';
import s from './TodoFilters.module.scss'



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
      {filtersArray.map((valueLabel: FiltersValueLabel) => //valueLabel
        <div 
          className={`${s.tab} ${currentValue === valueLabel.value ? s.isActive : ''}`} 
          key={valueLabel.value}
          onClick={() => handleClick(valueLabel.value)}
        >
          {valueLabel.label} ({listsInfo?.[`${valueLabel.value}`]})
        </div>
        )}
    </div>
  )
}

export default TodoFilters;