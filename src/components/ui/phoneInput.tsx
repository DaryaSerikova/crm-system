import { useState } from "react";
import { Select, Input, Space } from "antd";

interface PhoneValue {
  prefix?: string;
  phone?: string;
}

interface PhoneInputProps {
  value?: PhoneValue;
  onChange?: (value: PhoneValue) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value = {}, onChange }) => {

  const [prefix, setPrefix] = useState('7');
  const [phone, setPhone] = useState('');

  const triggerChange = (changedValue: PhoneValue) => {
    onChange?.({ ...value, ...changedValue });
  };

  const onPrefixChange = (newPrefix: string) => {
    if (!('prefix' in value)) {
      setPrefix(newPrefix);
    }
    triggerChange({ prefix: newPrefix });
  };

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    if (!('phone' in value)) {
      setPhone(newPhone);
    }
    triggerChange({ phone: newPhone });
  };

  return (
    <Space.Compact block>
      <Select
        value={value.prefix || prefix}
        onChange={onPrefixChange}
        style={{ width: 70 }}
        disabled
        options={[
          { label: '+7', value: '+7' },
        ]}
      />
      <Input 
        value={value.phone || phone} 
        onChange={onPhoneChange} 
        maxLength={10}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
        }}
        style={{ width: '100%' }} 
      />
    </Space.Compact>
  );
};
