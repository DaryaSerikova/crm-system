import { Select, Input, Form, Row, Col } from 'antd';
import type { Params } from '@/types/admin.types';
import { useDebounceCallback } from '@/utils/hooks/useDebounceCallback';
import s from './UserFilters.module.scss';



type UserFiltersProps = {
  getAndFetchUsers: (allValues?: Params) => void;
}

const UserFilters = ({getAndFetchUsers}: UserFiltersProps) => {
  const { Item } = Form;

  const debouncedGetAndFetchUsers = useDebounceCallback(getAndFetchUsers, 400);

  const handleValuesChange = (changedValues: Params, allValues: Params) => {
    console.log('changedValues: ', changedValues);
    console.log('allValues: ', allValues)

    if ('search' in changedValues) { //только для инпута debounce
      debouncedGetAndFetchUsers(allValues);
    } else {
      getAndFetchUsers(allValues);
    }
  }

  return (
    <div className={s.userFilters}>
    <Form
      name="basic"
      initialValues={{ 
        // sortBy?: null;
        // sortOrder?: null;
        // search?: '';
      }}
      layout="vertical"
      onValuesChange={handleValuesChange}
    >
      <Row gutter={[16, 16]} align="bottom">
        <Col xs={24} sm={12}>
          <Item<Params>
            label="Cортировка по имени/email/id"
            name="sortBy"
          >
            <Select
              defaultValue="id"
              options={[
                { value: 'username', label: 'По имени' },
                { value: 'email', label: 'По email' },
                { value: 'id', label: 'По id' },
              ]}
            />
          </Item>
        </Col>
        <Col xs={24} sm={12}>
          <Item<Params>
            label="Cортировка по порядку"
            name="sortOrder"
          >
            <Select
              defaultValue="none"
              options={[
                { value: 'asc', label: 'По возрастанию' },
                { value: 'desc', label: 'По  убыванию' },
                { value: 'none', label: 'По  умолчанию' },
              ]}
            />
          </Item>
        </Col>
      </Row>

      <Item<Params>
        name="search" 
        label="Поиск">
        <Input />
      </Item>
    </Form>
  </div>
  )
}

export default UserFilters;