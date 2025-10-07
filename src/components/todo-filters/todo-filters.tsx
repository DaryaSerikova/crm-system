import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { TodoInfo, Filter } from '../../types/types';
import s from './todo-filters.module.scss'



interface FiltersProps {
  setListFilter: Dispatch<SetStateAction<Filter>>,
  listsInfo: TodoInfo,
}
type FiltersValues = {1: 'all', 2:'inWork', 3:'completed'};
type FilterIds = 1 | 2 | 3;

interface FiltersValueLabel {
  id: FilterIds,
  value: Filter,
  label: string,
}


const TodoFilters = ({ setListFilter, listsInfo }: FiltersProps) => {
  const [currentFilterId, setCurrentFilterId] = useState<FilterIds>(1);

  const filtersArray: FiltersValueLabel[] = [
    {id: 1, value: 'all', label: 'Все'},
    {id: 2, value: 'inWork', label: 'В прогрессе'},
    {id: 3, value: 'completed', label: 'Завершенные'},
  ];
  const filtersValues: FiltersValues = {1: 'all', 2:'inWork', 3:'completed'};

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = +e.currentTarget.id as FilterIds;
    const filter: Filter = filtersValues[`${id}`];
    setListFilter(filter);
    setCurrentFilterId(id);
  }


  return (
    <div className={s.filters}>
      {filtersArray.map((item: FiltersValueLabel) => 
        <div 
          className={`${s.tab} ${currentFilterId === item.id ? s.isActive : ''}`} 
          key={item.id}
          id={`${item.id}`} 
          data-value={item.value}
          onClick={handleClick}
        >
          {item.label} ({listsInfo?.[`${item.value}`]})
          {/* количество задач не меняется в завершенных и в работе, если сделать toggle */}
        </div>
        )}
    </div>
  )
}

export default TodoFilters;