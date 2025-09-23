import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { TFilter, TListsInfo } from '../../App';
import s from './filters.module.scss';



interface IFiltersProps {
  setListFilter: Dispatch<SetStateAction<TFilter>>,
  listsInfo: TListsInfo,
}
type TFiltersValues = {1: 'all', 2:'inWork', 3:'completed'};
type TFilterIds = 1 | 2 | 3;

interface IFilters {
  id: TFilterIds,
  value: TFilter,
  label: string,
}


const Filters = ({ setListFilter, listsInfo }: IFiltersProps) => {
  const [currentFilterId, setCurrentFilterId] = useState<TFilterIds>(1);

  const filtersArray: IFilters[] = [
    {id: 1, value: 'all', label: 'Все'},
    {id: 2, value: 'inWork', label: 'В прогрессе'},
    {id: 3, value: 'completed', label: 'Завершенные'},
  ];
  const filtersValues: TFiltersValues = {1: 'all', 2:'inWork', 3:'completed'};

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = +e.currentTarget.id as TFilterIds;
    const filter: TFilter = filtersValues[`${id}`];
    setListFilter(filter);
    setCurrentFilterId(id);
  }


  return (
    <div className={s.filters}>
      {filtersArray.map((item: IFilters) => 
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

export default Filters;