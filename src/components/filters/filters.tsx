import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { type TFilter } from '../../App';
import s from './filters.module.scss';



interface IFiltersProps {
  setListFilter: Dispatch<SetStateAction<TFilter>>,
}

interface IFilters {
  id: number,
  value: string,
  label: string,
}

type TFilterIds = 1 | 2 | 3;

///количество задач
//покинуть список если tiggle

const Filters = ({ setListFilter }: IFiltersProps) => {
  const [currentFilterId, setCurrentFilterId] = useState<TFilterIds>(1)

  const filtersArray: IFilters[] = [
    {id: 1, value: 'all', label: 'Все'},
    {id: 2, value: 'inWork', label: 'В прогрессе'},
    {id: 3, value: 'completed', label: 'Завершенные'},
  ];
  const filtersValues = {1: 'all', 2:'inWork', 3:'completed'};
  // const filtersKeys = {'all': 1, 'inWork': 2, 'completed': 3};

  const handleClick = (e) => {
    const id = e.target.id;
    const filter: TFilter = filtersValues[`${id}`];
    setListFilter(filter);
    setCurrentFilterId(id);
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
          className={`${s.tab} ${+currentFilterId === +item.id ? s.isActive : ''}`} 
          key={item.id}
          id={+item.id}
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