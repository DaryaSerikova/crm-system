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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    
    if (e.target instanceof HTMLElement) {
      const filterValue: Filter = e.target?.dataset?.value as Filter; //это отчаяние
      setListFilter(filterValue);
      setCurrentValue(filterValue);
    }
    //а как если не через DOM узнать, какой текущий активный filter ???
    //сейчас по клику и data-атрибутам можно точно определить какой нажат элемент
  }


  return (
    <div className={s.filters}>
      {filtersArray.map((item: FiltersValueLabel) => 
        <div 
          className={`${s.tab} ${currentValue === item.value ? s.isActive : ''}`} 
          key={item.value}
          data-value={item.value}
          onClick={handleClick}
        >
          {item.label} ({listsInfo?.[`${item.value}`]})
          {/* количество задач не меняется в завершенных и в работе, если сделать toggle/delete/add */}
        </div>
        )}
    </div>
  )
}

export default TodoFilters;